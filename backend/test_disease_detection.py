#!/usr/bin/env python
"""Test script to analyze an image using the disease detection node."""

import base64
import json
from pathlib import Path
from app.agent.state import AgentState
from app.tools.disease_detection import disease_node

# Path to your image
IMAGE_PATH = Path(r"C:\Users\ASUS\OneDrive\Desktop\test_crop.jpg")

# Read and encode the image
if not IMAGE_PATH.exists():
    print(f"Image not found: {IMAGE_PATH}")
    exit(1)

image_data = IMAGE_PATH.read_bytes()
image_base64 = base64.b64encode(image_data).decode()

print(f"Image loaded: {IMAGE_PATH}")
print(f"Base64 length: {len(image_base64)} characters")
print()

# Create a state and run the disease detection
state = AgentState()
state["image_base64"] = image_base64

result = disease_node(state)

print("Disease Detection Result:")
print("-" * 50)
print(result["tool_result"])
