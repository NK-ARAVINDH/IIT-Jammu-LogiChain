"""
LogiChain AI — Central Risk Intelligence Engine
Integrates risk scores, confidence, expected delay, business impact, and explanations.
"""

import os
import json
import random
from datetime import datetime

# Supplier historical reliability profiles
SUPPLIER_PROFILES = {
    "Foxconn Technology Group": {"reliability": 94.5, "delays": 1.2, "frequency": 0.05},
    "Samsung SDI Co.": {"reliability": 89.2, "delays": 2.1, "frequency": 0.12},
    "BASF SE": {"reliability": 95.8, "delays": 0.8, "frequency": 0.04},
    "Tata Steel Limited": {"reliability": 82.1, "delays": 3.5, "frequency": 0.18},
    "BYD Electronics": {"reliability": 88.7, "delays": 2.4, "frequency": 0.11},
    "LG Chem Ltd.": {"reliability": 91.3, "delays": 1.7, "frequency": 0.08},
    "Reliance Industries": {"reliability": 86.4, "delays": 2.9, "frequency": 0.15},
    "Bosch GmbH": {"reliability": 96.2, "delays": 0.5, "frequency": 0.03},
    "Maersk Supply Service": {"reliability": 78.5, "delays": 4.2, "frequency": 0.22},
    "Taiwan Semiconductor (TSMC)": {"reliability": 98.4, "delays": 0.2, "frequency": 0.01},
    "Siemens AG": {"reliability": 95.0, "delays": 1.0, "frequency": 0.05},
    "Hyundai Heavy Industries": {"reliability": 84.6, "delays": 3.1, "frequency": 0.17},
    "Vedanta Limited": {"reliability": 81.2, "delays": 3.8, "frequency": 0.19},
    "Emirates Steel": {"reliability": 87.9, "delays": 2.5, "frequency": 0.13},
}

DEFAULT_PROFILE = {"reliability": 90.0, "delays": 1.5, "frequency": 0.08}

ALTERNATIVE_PORTS = {
    "Singapore": ["Port Klang (Malaysia)", "Laem Chabang (Thailand)"],
    "Shanghai": ["Ningbo-Zhoushan (China)", "Busan (South Korea)"],
    "Rotterdam": ["Antwerp (Belgium)", "Hamburg (Germany)"],
    "Los Angeles": ["Long Beach (USA)", "Oakland (USA)"],
    "Mumbai": ["Mundra (India)", "Colombo (Sri Lanka)"],
    "Dubai": ["Salalah (Oman)", "Hamad (Qatar)"],
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

def analyze_risk(shipment: dict, incidents: list, inventory_buffer_days: int = 3) -> dict:
    """
    Risk Intelligence Engine
    Inputs: shipment, incidents list, inventory_buffer_days
    Outputs: risk_score, confidence, severity, business_impact, expected_delay, explanation, recommendations
    """
    supplier_name = shipment.get("supplier", "Unknown")
    supplier_profile = SUPPLIER_PROFILES.get(supplier_name, DEFAULT_PROFILE)
    
    # 1. Expected Delay Calculation
    expected_delay = 0
    direct_incident_severity = 0
    matching_incidents_count = 0
    
    for inc in incidents:
        delay = inc.get("expected_delay_days", 0)
        expected_delay = max(expected_delay, delay)
        matching_incidents_count += 1
        if inc.get("severity", 0) > direct_incident_severity:
            direct_incident_severity = inc.get("severity", 0)
            
    # 2. Risk Score calculation
    # Base risk starts from supplier delays & incident counts
    base_risk = (100.0 - supplier_profile["reliability"]) * 0.4
    if incidents:
        # Scale direct incident severity to risk score
        base_risk += (direct_incident_severity / 10.0) * 50.0
        # Add factor for count of matching incidents
        base_risk += min(20.0, len(incidents) * 5.0)
    else:
        # Random variance for clean shipments
        random.seed(hash(shipment.get("shipment_id", "")))
        base_risk += random.uniform(5, 12)
        
    # Priority weighting
    priority = shipment.get("priority", "Medium")
    priority_mult = {"Critical": 1.4, "High": 1.2, "Medium": 1.0, "Low": 0.8}.get(priority, 1.0)
    risk_score = min(100.0, round(base_risk * priority_mult, 1))
    
    # Classify Severity
    if risk_score >= 76:
        severity = "Critical"
    elif risk_score >= 51:
        severity = "High"
    elif risk_score >= 26:
        severity = "Medium"
    else:
        severity = "Low"
        
    # Classify Business Impact
    # Depends on delay vs inventory buffer and priority
    if expected_delay > inventory_buffer_days:
        if priority in ("Critical", "High"):
            business_impact = "High"
        else:
            business_impact = "High"
    elif expected_delay == inventory_buffer_days:
        business_impact = "Medium"
    else:
        business_impact = "Low"
        
    # 3. Confidence Scoring
    # Base components:
    # - Incident severity
    # - Supplier history
    # - Data completeness (1.0 if container_id, items, etc. are present)
    has_meta = all(shipment.get(k) for k in ["container_id", "items", "weight", "quantity"])
    data_completeness = 100 if has_meta else 75
    
    # ETA certainty (closer = higher confidence in ETA/status, but more risk)
    eta_str = shipment.get("eta", "")
    eta_certainty = 95
    try:
        eta_date = datetime.strptime(eta_str, "%Y-%m-%d")
        days_until_eta = (eta_date - datetime.utcnow()).days
        if days_until_eta > 10:
            eta_certainty = 80
        elif days_until_eta < 3:
            eta_certainty = 98
    except:
        eta_certainty = 70
        
    # Final confidence score combination
    base_confidence = (supplier_profile["reliability"] * 0.3) + (data_completeness * 0.3) + (eta_certainty * 0.4)
    # Reduce slightly if we have high severity incidents with low confidence
    if incidents:
        avg_inc_conf = sum(inc.get("confidence", 0.85) for inc in incidents) / len(incidents)
        confidence_val = round(base_confidence * (0.8 + 0.2 * avg_inc_conf), 1)
    else:
        confidence_val = round(base_confidence, 1)
        
    # Ensure realistic range
    confidence = min(99.0, max(50.0, confidence_val))
    
    # 5. Explanations Generation
    reasons = []
    port = shipment.get("port", "Singapore")
    
    if incidents:
        reasons.append(f"Port congestion overlaps shipment ETA at {port}.")
    if supplier_profile["reliability"] < 88.0:
        reasons.append(f"Supplier '{supplier_name}' has low historical reliability ({supplier_profile['reliability']}%).")
    else:
        reasons.append(f"Supplier '{supplier_name}' maintains high historical reliability ({supplier_profile['reliability']}%).")
        
    if priority in ("Critical", "High"):
        reasons.append(f"Priority cargo requires expedited oversight.")
        
    alt_ports = ALTERNATIVE_PORTS.get(port, ["Nearby alternative port"])
    reasons.append(f"Alternative routes available via {alt_ports[0]}.")
    
    explanation_str = "\n".join(reasons)
    
    # 5. Recommendation Generation
    recommendations = []
    
    # Option 1: Route comparison / Reroute
    alt_port = alt_ports[0]
    rec_delay = max(0, expected_delay - random.randint(1, 3))
    savings = f"${random.randint(10, 45)}K in demurrage" if risk_score > 50 else "N/A"
    
    recommendations.append({
        "action": f"Reroute shipment via {alt_port} to bypass {port} incident.",
        "action_type": "reroute",
        "alternative_port": alt_port,
        "alternative_supplier": "",
        "alternative_route": f"{shipment.get('origin', 'Origin')} → {alt_port} → {shipment.get('destination', 'Destination')}",
        "business_impact": "Reduces transit delay risk but increases standard route cost slightly.",
        "confidence": round(confidence / 100.0, 2),
        "priority": "High" if risk_score > 50 else "Medium",
        "estimated_cost_impact": f"+${random.randint(5, 15)}K (+5%)",
        "estimated_savings": savings,
        "estimated_recovery_time": f"{rec_delay} Days",
        "co2_estimate": f"{random.randint(8, 15)} Tons"
    })
    
    # Option 2: Supplier change
    backup_list = ALTERNATIVE_SUPPLIERS.get(supplier_name, [])
    if backup_list:
        alt_supplier = backup_list[0]
        recommendations.append({
            "action": f"Activate backup supplier '{alt_supplier}' for pending quantities.",
            "action_type": "supplier_change",
            "alternative_port": "",
            "alternative_supplier": alt_supplier,
            "alternative_route": "",
            "business_impact": "Establishes backup production flow. Mitigates vendor failure risk.",
            "confidence": 0.80,
            "priority": "Medium",
            "estimated_cost_impact": f"+12% Unit Cost",
            "estimated_savings": f"${random.randint(20, 80)}K in stockout costs",
            "estimated_recovery_time": "7 Days",
            "co2_estimate": "N/A"
        })
        
    return {
        "risk_score": risk_score,
        "confidence": confidence,
        "severity": severity,
        "business_impact": business_impact,
        "expected_delay": expected_delay,
        "explanation": explanation_str,
        "reasons": reasons,
        "supplier_reliability": supplier_profile["reliability"],
        "recommendations": recommendations
    }
