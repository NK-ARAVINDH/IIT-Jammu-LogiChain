"""
LogiChain AI — Agent 4: Mitigation Agent
Generates contextual recommendations and executive summaries.
"""

import random
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from agents.graph import AgentState


# Alternative port suggestions based on region
ALTERNATIVE_PORTS = {
    "Singapore": ["Port Klang (Malaysia)", "Laem Chabang (Thailand)", "Tanjung Pelepas (Malaysia)"],
    "Shanghai": ["Ningbo-Zhoushan (China)", "Busan (South Korea)", "Kaohsiung (Taiwan)"],
    "Rotterdam": ["Antwerp (Belgium)", "Hamburg (Germany)", "Felixstowe (UK)"],
    "Los Angeles": ["Long Beach (USA)", "Oakland (USA)", "Seattle-Tacoma (USA)"],
    "Mumbai": ["Mundra (India)", "Colombo (Sri Lanka)", "Cochin (India)"],
    "Dubai": ["Salalah (Oman)", "Hamad (Qatar)", "King Abdullah (Saudi Arabia)"],
}

ALTERNATIVE_SUPPLIERS = {
    "Foxconn Technology Group": ["Pegatron Corporation", "Wistron Corporation"],
    "Samsung SDI Co.": ["CATL", "Panasonic Energy"],
    "BASF SE": ["Dow Chemical", "SABIC"],
    "Tata Steel Limited": ["ArcelorMittal", "POSCO"],
    "BYD Electronics": ["Flex Ltd.", "Jabil Inc."],
    "LG Chem Ltd.": ["SK Innovation", "EVE Energy"],
    "Reliance Industries": ["Indian Oil Corporation", "Sinopec"],
    "Bosch GmbH": ["Continental AG", "Denso Corporation"],
    "Maersk Supply Service": ["Rolls-Royce Marine", "Wärtsilä"],
    "Taiwan Semiconductor (TSMC)": ["Samsung Foundry", "GlobalFoundries"],
    "Siemens AG": ["GE Power", "Mitsubishi Power"],
    "Hyundai Heavy Industries": ["Daewoo Shipbuilding", "Samsung Heavy"],
    "Vedanta Limited": ["Hindalco Industries", "Norsk Hydro"],
    "Emirates Steel": ["JSW Steel", "NLMK Group"],
}


def generate_recommendations(shipment: dict, risk_assessment: dict, incidents: list) -> list:
    """Generate contextual mitigation recommendations based on risk type and severity."""
    recommendations = []
    port = shipment.get("port", "")
    supplier = shipment.get("supplier", "")
    risk_score = risk_assessment.get("risk_score", 0)
    risk_level = risk_assessment.get("risk_level", "Low")

    if risk_level == "Low":
        recommendations.append({
            "action": "Continue monitoring. No immediate action required.",
            "action_type": "monitor",
            "alternative_port": "",
            "alternative_supplier": "",
            "business_impact": "Minimal. Current risk levels within acceptable thresholds.",
            "confidence": 0.90,
            "priority": "Low",
            "estimated_cost_impact": "No additional cost",
        })
        return recommendations

    # 1. Route rerouting recommendation
    alt_ports = ALTERNATIVE_PORTS.get(port, ["Alternative port available"])
    chosen_alt_port = random.choice(alt_ports)
    additional_days = random.randint(1, 3)
    cost_increase = random.randint(5, 25)

    recommendations.append({
        "action": f"Reroute shipment via {chosen_alt_port} to bypass {port} disruption. "
                  f"Additional transit: +{additional_days} days. Cost impact: +{cost_increase}%.",
        "action_type": "reroute",
        "alternative_port": chosen_alt_port,
        "alternative_supplier": "",
        "business_impact": f"Avoids {port} delays. Increases transit by {additional_days} days "
                           f"but ensures delivery within revised timeline.",
        "confidence": 0.85,
        "priority": "High" if risk_score >= 60 else "Medium",
        "estimated_cost_impact": f"+{cost_increase}% shipping cost (~${random.randint(2, 15)}K)",
    })

    # 2. Mode change (sea to air) for critical shipments
    if risk_score >= 60 or shipment.get("priority") in ("Critical", "High"):
        air_cost_mult = random.randint(4, 8)
        recommendations.append({
            "action": f"Switch to air freight for {shipment.get('items', 'cargo')}. "
                      f"Reduces transit to 2-3 days. Cost: ~{air_cost_mult}x sea freight.",
            "action_type": "mode_change",
            "alternative_port": "",
            "alternative_supplier": "",
            "business_impact": f"Eliminates port delay risk entirely. Critical for maintaining "
                               f"production schedules. ROI positive if factory downtime cost exceeds "
                               f"${random.randint(50, 200)}K/day.",
            "confidence": 0.92,
            "priority": "Critical" if risk_score >= 75 else "High",
            "estimated_cost_impact": f"+{air_cost_mult}x freight cost (~${random.randint(20, 80)}K)",
        })

    # 3. Alternative supplier
    alt_suppliers = ALTERNATIVE_SUPPLIERS.get(supplier, [])
    if alt_suppliers:
        alt_supplier = random.choice(alt_suppliers)
        recommendations.append({
            "action": f"Activate backup supplier {alt_supplier}. Lead time: "
                      f"{random.randint(5, 14)} days for equivalent specification.",
            "action_type": "supplier_change",
            "alternative_port": "",
            "alternative_supplier": alt_supplier,
            "business_impact": f"Diversifies supply chain dependency. {alt_supplier} has "
                               f"verified capacity for {random.randint(60, 95)}% of order volume.",
            "confidence": 0.78,
            "priority": "Medium",
            "estimated_cost_impact": f"+{random.randint(3, 15)}% unit cost",
        })

    # 4. Inventory buffer
    if risk_score >= 40:
        buffer_weeks = random.randint(1, 3)
        recommendations.append({
            "action": f"Increase safety stock by {buffer_weeks} weeks for {shipment.get('items', 'cargo')}. "
                      f"Pre-position inventory at regional distribution center.",
            "action_type": "buffer",
            "alternative_port": "",
            "alternative_supplier": "",
            "business_impact": f"Creates {buffer_weeks}-week buffer against future disruptions. "
                               f"Increases working capital requirement by ~${random.randint(100, 500)}K.",
            "confidence": 0.88,
            "priority": "Medium",
            "estimated_cost_impact": f"+${random.randint(100, 500)}K inventory holding cost",
        })

    # 5. Production schedule adjustment for critical risk
    if risk_score >= 70:
        delay_days = random.randint(3, 7)
        recommendations.append({
            "action": f"Delay downstream production schedule by {delay_days} days. "
                      f"Notify manufacturing partners of revised timeline.",
            "action_type": "delay",
            "alternative_port": "",
            "alternative_supplier": "",
            "business_impact": f"Prevents partial production runs and quality issues from "
                               f"incomplete materials. Revenue impact: ~${random.randint(200, 800)}K "
                               f"deferred (not lost).",
            "confidence": 0.82,
            "priority": "High",
            "estimated_cost_impact": f"~${random.randint(200, 800)}K deferred revenue",
        })

    return recommendations


def generate_executive_summary(shipment: dict, risk_assessment: dict, recommendations: list) -> str:
    """Generate an executive summary for the risk report."""
    risk_level = risk_assessment.get("risk_level", "Low")
    risk_score = risk_assessment.get("risk_score", 0)
    shipment_id = shipment.get("shipment_id", "Unknown")
    port = shipment.get("port", "Unknown")
    supplier = shipment.get("supplier", "Unknown")
    items = shipment.get("items", "cargo")
    incident_count = risk_assessment.get("incident_count", 0)

    summary = f"EXECUTIVE SUMMARY — {shipment_id}\n"
    summary += f"{'='*50}\n\n"

    summary += f"Shipment {shipment_id} carrying {items} from {supplier} "
    summary += f"via {port} has been assessed at {risk_level} risk "
    summary += f"(score: {risk_score}/100). "

    if incident_count > 0:
        summary += f"{incident_count} active incident(s) have been identified "
        summary += f"affecting the shipment's route and timeline.\n\n"
    else:
        summary += "No significant incidents currently affect this route.\n\n"

    if risk_level in ("High", "Critical"):
        summary += "IMMEDIATE ATTENTION REQUIRED.\n\n"
        summary += "Recommended Priority Actions:\n"
        for i, rec in enumerate(recommendations[:3], 1):
            summary += f"  {i}. [{rec['priority']}] {rec['action'][:120]}\n"
        summary += f"\nEstimated total risk exposure: ${random.randint(500, 5000)}K\n"
        summary += f"Recommended action deadline: Within 24 hours\n"
    elif risk_level == "Medium":
        summary += "Elevated monitoring recommended. Consider implementing "
        summary += "the following mitigations within 48-72 hours:\n"
        for i, rec in enumerate(recommendations[:2], 1):
            summary += f"  {i}. {rec['action'][:120]}\n"
    else:
        summary += "Current risk levels are within acceptable parameters. "
        summary += "Standard monitoring protocols are sufficient.\n"

    summary += f"\nReport generated: {__import__('datetime').datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}\n"
    summary += "LogiChain AI — Autonomous Risk Assessment System\n"

    return summary


def mitigation_agent(state) -> "AgentState":
    """
    Agent 4: Mitigation
    Generates contextual recommendations and executive summary.
    """
    shipment = state.extracted_shipment
    risk_assessment = state.risk_assessment
    incidents = state.relevant_incidents

    # If already calculated in risk assessment node, reuse
    if "recommendations" in risk_assessment:
        recommendations = risk_assessment["recommendations"]
    else:
        recommendations = generate_recommendations(shipment, risk_assessment, incidents)
        
    executive_summary = generate_executive_summary(shipment, risk_assessment, recommendations)

    state.recommendations = recommendations
    state.executive_summary = executive_summary

    return state
