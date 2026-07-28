"""
LogiChain AI — SQLAlchemy ORM Models
Tables: Shipments, Incidents, RiskReports, Recommendations, UploadedDocuments
"""

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String(50), unique=True, index=True, nullable=False)
    supplier = Column(String(200), nullable=False)
    origin = Column(String(200), nullable=False)
    destination = Column(String(200), nullable=False)
    port = Column(String(100), nullable=False)
    eta = Column(String(50), nullable=False)
    items = Column(String(500), nullable=False)
    quantity = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)  # in kg
    container_id = Column(String(50), nullable=False)
    priority = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    status = Column(String(30), default="In Transit")
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="Low")
    confidence = Column(Float, default=0.85)
    severity = Column(String(20), default="Low")
    business_impact = Column(String(20), default="Low")
    expected_delay = Column(Integer, default=0)
    explanation = Column(Text, default="")
    supplier_reliability = Column(Float, default=95.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    risk_reports = relationship("RiskReport", back_populates="shipment")
    documents = relationship("UploadedDocument", back_populates="shipment")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(String(100), nullable=False)
    severity = Column(Integer, nullable=False)  # 1-10
    affected_port = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    confidence = Column(Float, default=0.85)
    active = Column(Boolean, default=True)
    region = Column(String(100), default="")
    expected_delay_days = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)


class RiskReport(Base):
    __tablename__ = "risk_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(50), unique=True, index=True, nullable=False)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    overall_risk = Column(String(20), nullable=False)  # Low, Medium, High, Critical
    risk_score = Column(Float, nullable=False)
    reasons = Column(Text, nullable=False)  # JSON string of reason list
    affected_incidents = Column(Text, nullable=False)  # JSON string of incident ID list
    executive_summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="risk_reports")
    recommendations = relationship("Recommendation", back_populates="risk_report")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    risk_report_id = Column(Integer, ForeignKey("risk_reports.id"), nullable=False)
    action = Column(String(300), nullable=False)
    action_type = Column(String(50), nullable=False)  # reroute, supplier_change, mode_change, buffer, delay
    alternative_port = Column(String(100), default="")
    alternative_supplier = Column(String(200), default="")
    business_impact = Column(Text, default="")
    confidence = Column(Float, default=0.8)
    priority = Column(String(20), default="Medium")
    estimated_cost_impact = Column(String(100), default="")
    alternative_route = Column(Text, default="")
    estimated_savings = Column(String(100), default="")
    estimated_recovery_time = Column(String(100), default="")
    co2_estimate = Column(String(100), default="")

    risk_report = relationship("RiskReport", back_populates="recommendations")


class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, docx, txt
    extracted_text = Column(Text, default="")
    structured_data = Column(Text, default="{}")
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="documents")
