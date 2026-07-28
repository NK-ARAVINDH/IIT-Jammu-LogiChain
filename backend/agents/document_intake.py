"""
LogiChain AI — Agent 1: Document Intake Agent
Parses uploaded documents (PDF, DOCX, TXT) and extracts structured shipment data.
"""

import re
import random
from datetime import datetime, timedelta
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from agents.graph import AgentState


# Fallback demo shipments for when parsing can't extract all fields
DEMO_SHIPMENT_TEMPLATES = [
    {
        "shipment_id": "SHP-2024-{rand}",
        "supplier": "Foxconn Technology Group",
        "origin": "Shenzhen, China",
        "destination": "Stuttgart, Germany",
        "port": "Singapore",
        "items": "Semiconductor Chips (14nm)",
        "quantity": 50000,
        "weight": 2400.0,
        "container_id": "MSKU-{rand2}",
        "priority": "Critical",
    },
    {
        "shipment_id": "SHP-2024-{rand}",
        "supplier": "Samsung SDI Co.",
        "origin": "Ulsan, South Korea",
        "destination": "Detroit, USA",
        "port": "Los Angeles",
        "items": "EV Battery Modules (NCM811)",
        "quantity": 3200,
        "weight": 18500.0,
        "container_id": "TCLU-{rand2}",
        "priority": "High",
    },
    {
        "shipment_id": "SHP-2024-{rand}",
        "supplier": "Tata Steel Limited",
        "origin": "Jamshedpur, India",
        "destination": "Amsterdam, Netherlands",
        "port": "Rotterdam",
        "items": "Hot-Rolled Steel Coils",
        "quantity": 1200,
        "weight": 45000.0,
        "container_id": "TCLU-{rand2}",
        "priority": "Medium",
    },
]


def extract_text_from_file(filepath: str, file_type: str) -> str:
    """Extract raw text from uploaded file."""
    if file_type == "pdf":
        try:
            import pdfplumber
            with pdfplumber.open(filepath) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text.strip()
        except Exception:
            return ""
    elif file_type == "docx":
        try:
            from docx import Document
            doc = Document(filepath)
            return "\n".join([p.text for p in doc.paragraphs]).strip()
        except Exception:
            return ""
    elif file_type == "txt":
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            return ""
    return ""


def parse_structured_fields(text: str) -> dict:
    """
    Extract structured shipment fields from raw text using regex + heuristics.
    This simulates AI-powered document understanding.
    """
    fields = {}

    # Shipment ID patterns
    sid_match = re.search(r'(?:shipment|shp|ref|reference|b/l|bol)[#:\s-]*([A-Z0-9-]+\d{3,})', text, re.IGNORECASE)
    if sid_match:
        fields["shipment_id"] = sid_match.group(1).upper()

    # Supplier
    supplier_match = re.search(r'(?:supplier|shipper|consignor|from)[:\s]+([A-Za-z\s&.,]+?)(?:\n|$)', text, re.IGNORECASE)
    if supplier_match:
        fields["supplier"] = supplier_match.group(1).strip()

    # Origin
    origin_match = re.search(r'(?:origin|from|port of loading|pol)[:\s]+([A-Za-z\s,]+?)(?:\n|$)', text, re.IGNORECASE)
    if origin_match:
        fields["origin"] = origin_match.group(1).strip()

    # Destination
    dest_match = re.search(r'(?:destination|to|consignee location|port of discharge|pod)[:\s]+([A-Za-z\s,]+?)(?:\n|$)', text, re.IGNORECASE)
    if dest_match:
        fields["destination"] = dest_match.group(1).strip()

    # Port
    port_match = re.search(r'(?:port|discharge port|arrival port)[:\s]+([A-Za-z\s]+?)(?:\n|$)', text, re.IGNORECASE)
    if port_match:
        fields["port"] = port_match.group(1).strip()
    else:
        # Try to infer port from destination
        port_map = {
            "singapore": "Singapore", "shanghai": "Shanghai", "rotterdam": "Rotterdam",
            "los angeles": "Los Angeles", "la": "Los Angeles",
            "mumbai": "Mumbai", "nhava sheva": "Mumbai",
            "dubai": "Dubai", "jebel ali": "Dubai",
        }
        for key, port_name in port_map.items():
            if key in text.lower():
                fields["port"] = port_name
                break

    # ETA
    eta_match = re.search(r'(?:eta|estimated arrival|arrival date|expected)[:\s]+([\d]{4}[-/][\d]{1,2}[-/][\d]{1,2})', text, re.IGNORECASE)
    if eta_match:
        fields["eta"] = eta_match.group(1).replace("/", "-")
    else:
        # Try other date formats
        date_match = re.search(r'(\d{1,2}[/-]\d{1,2}[/-]\d{4})', text)
        if date_match:
            fields["eta"] = date_match.group(1)

    # Items / Goods
    items_match = re.search(r'(?:goods|items|commodity|description|cargo)[:\s]+([A-Za-z\s,()0-9&-]+?)(?:\n|$)', text, re.IGNORECASE)
    if items_match:
        fields["items"] = items_match.group(1).strip()[:200]

    # Quantity
    qty_match = re.search(r'(?:quantity|qty|units|pieces|pcs)[:\s]*(\d[\d,]*)', text, re.IGNORECASE)
    if qty_match:
        fields["quantity"] = int(qty_match.group(1).replace(",", ""))

    # Weight
    weight_match = re.search(r'(?:weight|gross weight|net weight)[:\s]*([\d,.]+)\s*(?:kg|tons|mt)?', text, re.IGNORECASE)
    if weight_match:
        fields["weight"] = float(weight_match.group(1).replace(",", ""))

    # Container ID
    container_match = re.search(r'(?:container|cntr)[#:\s-]*([A-Z]{4}[-\s]?\d{7})', text, re.IGNORECASE)
    if container_match:
        fields["container_id"] = container_match.group(1).upper().replace(" ", "-")

    # Priority
    priority_match = re.search(r'(?:priority|urgency)[:\s]*(low|medium|high|critical)', text, re.IGNORECASE)
    if priority_match:
        fields["priority"] = priority_match.group(1).capitalize()

    return fields


def fill_missing_fields(fields: dict) -> dict:
    """Fill in any missing fields with realistic demo data."""
    rand_num = random.randint(1000, 9999)
    rand_container = random.randint(1000000, 9999999)

    defaults = random.choice(DEMO_SHIPMENT_TEMPLATES)

    final = {
        "shipment_id": fields.get("shipment_id", defaults["shipment_id"].format(rand=rand_num, rand2=rand_container)),
        "supplier": fields.get("supplier", defaults["supplier"]),
        "origin": fields.get("origin", defaults["origin"]),
        "destination": fields.get("destination", defaults["destination"]),
        "port": fields.get("port", defaults["port"]),
        "eta": fields.get("eta", (datetime.utcnow() + timedelta(days=random.randint(2, 8))).strftime("%Y-%m-%d")),
        "items": fields.get("items", defaults["items"]),
        "quantity": fields.get("quantity", defaults["quantity"]),
        "weight": fields.get("weight", defaults["weight"]),
        "container_id": fields.get("container_id", defaults["container_id"].format(rand=rand_num, rand2=rand_container)),
        "priority": fields.get("priority", defaults["priority"]),
    }

    return final


def document_intake_agent(state) -> "AgentState":
    """
    Agent 1: Document Intake
    Extracts structured shipment information from uploaded documents.
    """
    raw_text = state.raw_text
    filename = state.filename

    # Parse whatever we can from the text
    extracted_fields = parse_structured_fields(raw_text) if raw_text else {}

    # Count how many fields were actually extracted
    extracted_count = len(extracted_fields)

    # Fill any missing fields with realistic defaults
    complete_fields = fill_missing_fields(extracted_fields)

    # Add extraction metadata
    complete_fields["_extraction_metadata"] = {
        "source_file": filename,
        "fields_extracted": extracted_count,
        "fields_total": 11,
        "confidence": round(min(0.95, 0.5 + (extracted_count * 0.05)), 2),
        "method": "regex_heuristic" if raw_text else "demo_template",
    }

    state.extracted_shipment = complete_fields
    return state
