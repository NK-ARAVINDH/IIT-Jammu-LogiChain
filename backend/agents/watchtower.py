"""
LogiChain AI — Agent 2: Global Watchtower Agent
Scans simulated external data feeds for risks affecting the shipment's route.
"""

from models import Incident
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from agents.graph import AgentState


def watchtower_agent(state) -> "AgentState":
    """
    Agent 2: Global Watchtower
    Checks simulated global events (port congestion, weather, strikes, etc.)
    against the shipment's port and route.
    """
    shipment = state.extracted_shipment
    db = state.db_session
    port = shipment.get("port", "")

    if not db:
        state.relevant_incidents = []
        return state

    # Query active incidents
    all_incidents = db.query(Incident).filter(Incident.active == True).all()  # noqa: E712

    relevant = []
    for inc in all_incidents:
        relevance_score = 0.0
        match_reasons = []

        # Direct port match
        if inc.affected_port.lower() == port.lower():
            relevance_score += 0.7
            match_reasons.append(f"Direct port match: {port}")

        # Regional proximity (incidents in same region affect nearby ports)
        region_port_map = {
            "Southeast Asia": ["Singapore"],
            "East Asia": ["Shanghai"],
            "Europe": ["Rotterdam"],
            "North America": ["Los Angeles"],
            "South Asia": ["Mumbai"],
            "Middle East": ["Dubai"],
        }
        shipment_region = None
        for region, ports in region_port_map.items():
            if port in ports:
                shipment_region = region
                break

        if shipment_region and inc.region == shipment_region and relevance_score < 0.5:
            relevance_score += 0.3
            match_reasons.append(f"Same region: {shipment_region}")

        # Global events (fuel price, cyber, etc.) affect everyone
        if inc.region == "Global":
            relevance_score += 0.4
            match_reasons.append("Global event affecting all routes")

        # High severity events have broader impact
        if inc.severity >= 8 and relevance_score > 0:
            relevance_score += 0.1
            match_reasons.append(f"High severity ({inc.severity}/10) amplifies impact")

        if relevance_score >= 0.3:
            relevant.append({
                "incident_id": inc.incident_id,
                "type": inc.type,
                "severity": inc.severity,
                "affected_port": inc.affected_port,
                "description": inc.description,
                "confidence": inc.confidence,
                "expected_delay_days": inc.expected_delay_days,
                "relevance_score": round(relevance_score, 2),
                "match_reasons": match_reasons,
            })

    # Sort by relevance
    relevant.sort(key=lambda x: x["relevance_score"], reverse=True)

    state.relevant_incidents = relevant
    return state
