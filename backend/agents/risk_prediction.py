from services.risk_engine import analyze_risk
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from agents.graph import AgentState


def calculate_risk_score(shipment: dict, incidents: list) -> tuple:
    """Delegates risk calculation to the unified RiskIntelligenceEngine."""
    result = analyze_risk(shipment, incidents)
    return result["risk_score"], result["severity"], result["reasons"]

def risk_prediction_agent(state) -> "AgentState":
    """
    Agent 3: Risk Prediction
    Invokes the central risk engine to calculate scores, confidence metrics and explanations.
    """
    shipment = state.extracted_shipment
    incidents = state.relevant_incidents
    
    result = analyze_risk(shipment, incidents)
    
    state.risk_assessment = {
        "shipment_id": shipment.get("shipment_id", ""),
        "risk_score": result["risk_score"],
        "risk_level": result["severity"],
        "confidence": result["confidence"],
        "severity": result["severity"],
        "business_impact": result["business_impact"],
        "expected_delay": result["expected_delay"],
        "explanation": result["explanation"],
        "reasons": result["reasons"],
        "supplier_reliability": result["supplier_reliability"],
        "affected_incidents": [inc["incident_id"] for inc in incidents],
        "incident_count": len(incidents),
        "recommendations": result["recommendations"] # pre-calculated to avoid duplicate work
    }
    
    return state

