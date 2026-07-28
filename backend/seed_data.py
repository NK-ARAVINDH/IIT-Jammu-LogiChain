"""
LogiChain AI — Seed Data Generator
Populates the database with 20 shipments, 10 suppliers, 6 ports, and 15 incidents.
"""

import json
import os
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import Shipment, Incident

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


SHIPMENTS = [
    {
        "shipment_id": "SHP-2024-0847",
        "supplier": "Foxconn Technology Group",
        "origin": "Shenzhen, China",
        "destination": "Stuttgart, Germany",
        "port": "Singapore",
        "eta": (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "items": "Semiconductor Chips (14nm)",
        "quantity": 50000,
        "weight": 2400.0,
        "container_id": "MSKU-7294831",
        "priority": "Critical",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0848",
        "supplier": "Samsung SDI Co.",
        "origin": "Ulsan, South Korea",
        "destination": "Detroit, USA",
        "port": "Los Angeles",
        "eta": (datetime.utcnow() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "items": "EV Battery Modules (NCM811)",
        "quantity": 3200,
        "weight": 18500.0,
        "container_id": "TCLU-5518294",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0849",
        "supplier": "BASF SE",
        "origin": "Ludwigshafen, Germany",
        "destination": "Chennai, India",
        "port": "Mumbai",
        "eta": (datetime.utcnow() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "items": "Industrial Catalysts & Polymers",
        "quantity": 8400,
        "weight": 32000.0,
        "container_id": "MSKU-3381956",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0850",
        "supplier": "Tata Steel Limited",
        "origin": "Jamshedpur, India",
        "destination": "Amsterdam, Netherlands",
        "port": "Rotterdam",
        "eta": (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d"),
        "items": "Hot-Rolled Steel Coils",
        "quantity": 1200,
        "weight": 45000.0,
        "container_id": "TCLU-8827463",
        "priority": "Medium",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0851",
        "supplier": "BYD Electronics",
        "origin": "Huizhou, China",
        "destination": "Dubai, UAE",
        "port": "Dubai",
        "eta": (datetime.utcnow() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "items": "Consumer Electronics Components",
        "quantity": 25000,
        "weight": 8900.0,
        "container_id": "MSKU-6612847",
        "priority": "Medium",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0852",
        "supplier": "LG Chem Ltd.",
        "origin": "Ochang, South Korea",
        "destination": "Fremont, USA",
        "port": "Los Angeles",
        "eta": (datetime.utcnow() + timedelta(days=6)).strftime("%Y-%m-%d"),
        "items": "Lithium-Ion Battery Cells",
        "quantity": 15000,
        "weight": 22000.0,
        "container_id": "TCLU-4429175",
        "priority": "Critical",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0853",
        "supplier": "Reliance Industries",
        "origin": "Jamnagar, India",
        "destination": "Singapore",
        "port": "Singapore",
        "eta": (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "items": "Refined Petrochemicals",
        "quantity": 5000,
        "weight": 62000.0,
        "container_id": "MSKU-9917352",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0854",
        "supplier": "Bosch GmbH",
        "origin": "Stuttgart, Germany",
        "destination": "Pune, India",
        "port": "Mumbai",
        "eta": (datetime.utcnow() + timedelta(days=8)).strftime("%Y-%m-%d"),
        "items": "Automotive Sensor Arrays",
        "quantity": 42000,
        "weight": 5600.0,
        "container_id": "TCLU-2234891",
        "priority": "Medium",
        "status": "Customs Clearance",
    },
    {
        "shipment_id": "SHP-2024-0855",
        "supplier": "Maersk Supply Service",
        "origin": "Copenhagen, Denmark",
        "destination": "Shanghai, China",
        "port": "Shanghai",
        "eta": (datetime.utcnow() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "items": "Marine Engine Parts",
        "quantity": 850,
        "weight": 14000.0,
        "container_id": "MSKU-5543728",
        "priority": "Low",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0856",
        "supplier": "Taiwan Semiconductor (TSMC)",
        "origin": "Hsinchu, Taiwan",
        "destination": "Phoenix, USA",
        "port": "Los Angeles",
        "eta": (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "items": "Advanced Chipsets (5nm)",
        "quantity": 80000,
        "weight": 1200.0,
        "container_id": "TCLU-7781234",
        "priority": "Critical",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0857",
        "supplier": "Siemens AG",
        "origin": "Munich, Germany",
        "destination": "Riyadh, Saudi Arabia",
        "port": "Dubai",
        "eta": (datetime.utcnow() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "items": "Industrial Turbine Components",
        "quantity": 120,
        "weight": 38000.0,
        "container_id": "MSKU-1198467",
        "priority": "High",
        "status": "Loading",
    },
    {
        "shipment_id": "SHP-2024-0858",
        "supplier": "Foxconn Technology Group",
        "origin": "Zhengzhou, China",
        "destination": "Rotterdam, Netherlands",
        "port": "Rotterdam",
        "eta": (datetime.utcnow() + timedelta(days=10)).strftime("%Y-%m-%d"),
        "items": "Smartphone Assembly Kits",
        "quantity": 35000,
        "weight": 7800.0,
        "container_id": "TCLU-3356912",
        "priority": "Medium",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0859",
        "supplier": "Hyundai Heavy Industries",
        "origin": "Ulsan, South Korea",
        "destination": "Hamburg, Germany",
        "port": "Shanghai",
        "eta": (datetime.utcnow() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "items": "Ship Engine Block Assemblies",
        "quantity": 45,
        "weight": 92000.0,
        "container_id": "MSKU-8843219",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0860",
        "supplier": "Vedanta Limited",
        "origin": "Tuticorin, India",
        "destination": "Antwerp, Belgium",
        "port": "Mumbai",
        "eta": (datetime.utcnow() + timedelta(days=6)).strftime("%Y-%m-%d"),
        "items": "Zinc & Aluminum Ingots",
        "quantity": 2800,
        "weight": 56000.0,
        "container_id": "TCLU-6694527",
        "priority": "Low",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0861",
        "supplier": "Samsung SDI Co.",
        "origin": "Xian, China",
        "destination": "Nagoya, Japan",
        "port": "Shanghai",
        "eta": (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "items": "OLED Display Panels",
        "quantity": 22000,
        "weight": 4200.0,
        "container_id": "MSKU-4427183",
        "priority": "Critical",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0862",
        "supplier": "Emirates Steel",
        "origin": "Abu Dhabi, UAE",
        "destination": "Mumbai, India",
        "port": "Dubai",
        "eta": (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "items": "Structural Steel Beams",
        "quantity": 900,
        "weight": 67000.0,
        "container_id": "TCLU-9912834",
        "priority": "Medium",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0863",
        "supplier": "BASF SE",
        "origin": "Antwerp, Belgium",
        "destination": "Los Angeles, USA",
        "port": "Rotterdam",
        "eta": (datetime.utcnow() + timedelta(days=9)).strftime("%Y-%m-%d"),
        "items": "Specialty Coatings & Resins",
        "quantity": 6200,
        "weight": 18000.0,
        "container_id": "MSKU-2267451",
        "priority": "Low",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0864",
        "supplier": "Tata Steel Limited",
        "origin": "Kalinganagar, India",
        "destination": "Singapore",
        "port": "Singapore",
        "eta": (datetime.utcnow() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "items": "Cold-Rolled Steel Sheets",
        "quantity": 1500,
        "weight": 41000.0,
        "container_id": "TCLU-1185629",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0865",
        "supplier": "LG Chem Ltd.",
        "origin": "Nanjing, China",
        "destination": "Wolfsburg, Germany",
        "port": "Shanghai",
        "eta": (datetime.utcnow() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "items": "Cathode Material (NCA)",
        "quantity": 9500,
        "weight": 12000.0,
        "container_id": "MSKU-3398172",
        "priority": "High",
        "status": "In Transit",
    },
    {
        "shipment_id": "SHP-2024-0866",
        "supplier": "Reliance Industries",
        "origin": "Dahej, India",
        "destination": "Houston, USA",
        "port": "Mumbai",
        "eta": (datetime.utcnow() + timedelta(days=12)).strftime("%Y-%m-%d"),
        "items": "Polypropylene Granules",
        "quantity": 4800,
        "weight": 72000.0,
        "container_id": "TCLU-7743918",
        "priority": "Low",
        "status": "Loading",
    },
]


def load_incidents():
    """Load incidents from JSON file."""
    with open(os.path.join(DATA_DIR, "incidents.json"), "r") as f:
        data = json.load(f)
    return data["incidents"]


def seed_database():
    """Seed the database with demo data."""
    from models import Base  # noqa
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Shipment).count() > 0:
            print("Database already seeded. Skipping.")
            return

        # Seed shipments
        for s in SHIPMENTS:
            shipment = Shipment(**s)
            db.add(shipment)

        # Seed incidents
        incidents = load_incidents()
        for inc in incidents:
            incident = Incident(
                incident_id=inc["incident_id"],
                type=inc["type"],
                severity=inc["severity"],
                affected_port=inc["affected_port"],
                description=inc["description"],
                confidence=inc["confidence"],
                region=inc["region"],
                expected_delay_days=inc["expected_delay_days"],
                active=True,
                timestamp=datetime.utcnow() - timedelta(hours=hash(inc["incident_id"]) % 48),
            )
            db.add(incident)

        db.commit()
        print(f"[OK] Seeded {len(SHIPMENTS)} shipments and {len(incidents)} incidents.")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
