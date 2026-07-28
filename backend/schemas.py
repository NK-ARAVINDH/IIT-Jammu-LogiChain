"""
LogiChain AI — Pydantic Schemas (v1 compatible)
Request/Response models for all API endpoints.
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# --- Shipment Schemas ---

class ShipmentBase(BaseModel):
    shipment_id: str
    supplier: str
    origin: str
    destination: str
    port: str
    eta: str
    items: str
    quantity: int
    weight: float
    container_id: str
    priority: str = "Medium"

class ShipmentResponse(ShipmentBase):
    id: int
    status: str
    risk_score: float
    risk_level: str
    created_at: datetime

    class Config:
        orm_mode = True


# --- Incident Schemas ---

class IncidentResponse(BaseModel):
    id: int
    incident_id: str
    type: str
    severity: int
    affected_port: str
    description: str
    confidence: float
    active: bool
    region: str
    expected_delay_days: int
    timestamp: datetime

    class Config:
        orm_mode = True


# --- Risk Report Schemas ---

class RecommendationResponse(BaseModel):
    id: int
    action: str
    action_type: str
    alternative_port: str
    alternative_supplier: str
    business_impact: str
    confidence: float
    priority: str
    estimated_cost_impact: str

    class Config:
        orm_mode = True

class RiskReportResponse(BaseModel):
    id: int
    report_id: str
    shipment_id: int
    overall_risk: str
    risk_score: float
    reasons: list
    affected_incidents: list
    executive_summary: str
    created_at: datetime
    recommendations: List[RecommendationResponse] = []

    class Config:
        orm_mode = True


# --- Agent Schemas ---

class AgentStepStatus(BaseModel):
    agent_name: str
    status: str
    message: str = ""
    result: Optional[dict] = None
    duration_ms: int = 0

class AgentWorkflowResponse(BaseModel):
    workflow_id: str
    steps: List[AgentStepStatus]
    final_result: Optional[dict] = None
    total_duration_ms: int = 0


# --- Dashboard Schemas ---

class DashboardStats(BaseModel):
    active_shipments: int
    high_risk_shipments: int
    critical_shipments: int
    open_incidents: int
    total_recommendations: int
    avg_risk_score: float
    risk_distribution: dict
    port_delays: dict


# --- Upload Schemas ---

class UploadResponse(BaseModel):
    document_id: int
    filename: str
    extracted_fields: dict
    workflow_id: str
    message: str


# --- What-If Schemas ---

class WhatIfRequest(BaseModel):
    scenario: str
    target_port: str
    severity_override: int = 9

class WhatIfShipmentImpact(BaseModel):
    shipment_id: str
    original_risk: str
    new_risk: str
    original_score: float
    new_score: float
    delay_days: int
    recommendation: str

class WhatIfResponse(BaseModel):
    scenario: str
    target_port: str
    affected_shipments: List[WhatIfShipmentImpact]
    total_affected: int
    summary: str


# --- WebSocket Message ---

class WSMessage(BaseModel):
    type: str
    data: dict
