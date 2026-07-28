"""
LogiChain AI — Agent Workflow Graph
Directed graph: Document Intake → Watchtower → Risk Prediction → Mitigation
Mirrors LangGraph's state-machine pattern with WebSocket progress notifications.
"""

import asyncio
import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional


@dataclass
class AgentState:
    """Shared state passed through the agent workflow."""
    workflow_id: str = ""
    # Input
    raw_text: str = ""
    filename: str = ""
    file_type: str = ""
    # Document Intake output
    extracted_shipment: dict = field(default_factory=dict)
    # Watchtower output
    relevant_incidents: list = field(default_factory=list)
    # Risk Prediction output
    risk_assessment: dict = field(default_factory=dict)
    # Mitigation output
    recommendations: list = field(default_factory=list)
    executive_summary: str = ""
    # Metadata
    steps_completed: list = field(default_factory=list)
    errors: list = field(default_factory=list)
    db_session: Any = None
    ws_callback: Optional[Callable] = None


class AgentNode:
    """A node in the agent graph."""
    def __init__(self, name: str, func: Callable, description: str = ""):
        self.name = name
        self.func = func
        self.description = description


class AgentGraph:
    """
    Directed acyclic graph for agent workflow execution.
    Models the LangGraph pattern: nodes are agents, edges define execution order.
    """

    def __init__(self):
        self.nodes: Dict[str, AgentNode] = {}
        self.edges: List[tuple] = []
        self.entry_point: str = ""

    def add_node(self, name: str, func: Callable, description: str = ""):
        self.nodes[name] = AgentNode(name, func, description)

    def add_edge(self, from_node: str, to_node: str):
        self.edges.append((from_node, to_node))

    def set_entry_point(self, name: str):
        self.entry_point = name

    def _get_execution_order(self) -> List[str]:
        """Topological sort to get execution order."""
        order = []
        visited = set()

        def visit(node_name):
            if node_name in visited:
                return
            visited.add(node_name)
            # Find all nodes this one leads to
            for src, dst in self.edges:
                if src == node_name:
                    visit(dst)
            order.insert(0, node_name)

        # Start from entry point
        if self.entry_point:
            visit(self.entry_point)
        else:
            for name in self.nodes:
                visit(name)

        return order

    async def run(self, state: AgentState) -> AgentState:
        """Execute the workflow graph."""
        if not state.workflow_id:
            state.workflow_id = f"WF-{uuid.uuid4().hex[:8].upper()}"

        execution_order = self._get_execution_order()

        for node_name in execution_order:
            if node_name not in self.nodes:
                continue

            node = self.nodes[node_name]
            start_time = time.time()

            # Notify: agent starting
            if state.ws_callback:
                await state.ws_callback({
                    "type": "agent_update",
                    "data": {
                        "workflow_id": state.workflow_id,
                        "agent": node_name,
                        "status": "running",
                        "message": f"Running {node.description or node_name}...",
                    }
                })

            try:
                # Execute the agent (supports both sync and async)
                if asyncio.iscoroutinefunction(node.func):
                    state = await node.func(state)
                else:
                    state = node.func(state)

                duration_ms = int((time.time() - start_time) * 1000)

                state.steps_completed.append({
                    "agent": node_name,
                    "status": "completed",
                    "duration_ms": duration_ms,
                })

                # Notify: agent completed
                if state.ws_callback:
                    await state.ws_callback({
                        "type": "agent_update",
                        "data": {
                            "workflow_id": state.workflow_id,
                            "agent": node_name,
                            "status": "completed",
                            "message": f"Completed {node.description or node_name}",
                            "duration_ms": duration_ms,
                        }
                    })

                # Small delay for visual effect in demo
                await asyncio.sleep(0.5)

            except Exception as e:
                duration_ms = int((time.time() - start_time) * 1000)
                error_msg = f"Error in {node_name}: {str(e)}"
                state.errors.append(error_msg)
                state.steps_completed.append({
                    "agent": node_name,
                    "status": "error",
                    "error": str(e),
                    "duration_ms": duration_ms,
                })

                if state.ws_callback:
                    await state.ws_callback({
                        "type": "agent_update",
                        "data": {
                            "workflow_id": state.workflow_id,
                            "agent": node_name,
                            "status": "error",
                            "message": error_msg,
                            "duration_ms": duration_ms,
                        }
                    })

        # Final notification
        if state.ws_callback:
            await state.ws_callback({
                "type": "workflow_complete",
                "data": {
                    "workflow_id": state.workflow_id,
                    "steps": state.steps_completed,
                    "risk_assessment": state.risk_assessment,
                    "recommendations": [r for r in state.recommendations],
                    "executive_summary": state.executive_summary,
                }
            })

        return state


def build_workflow_graph() -> AgentGraph:
    """Build the standard 4-agent workflow graph."""
    from agents.document_intake import document_intake_agent
    from agents.watchtower import watchtower_agent
    from agents.risk_prediction import risk_prediction_agent
    from agents.mitigation import mitigation_agent

    graph = AgentGraph()

    graph.add_node("document_intake", document_intake_agent, "Parsing uploaded document")
    graph.add_node("watchtower", watchtower_agent, "Checking global risk events")
    graph.add_node("risk_prediction", risk_prediction_agent, "Calculating risk scores")
    graph.add_node("mitigation", mitigation_agent, "Generating mitigation recommendations")

    graph.add_edge("document_intake", "watchtower")
    graph.add_edge("watchtower", "risk_prediction")
    graph.add_edge("risk_prediction", "mitigation")

    graph.set_entry_point("document_intake")

    return graph
