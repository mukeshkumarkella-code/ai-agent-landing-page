# Google Gemini Integration Guide

This document outlines how to integrate and configure Google Gemini models as the core intelligence engine for the Liam AI Solutions agent pipeline.

---

## 1. Supported Models & Use Cases

We recommend utilizing the following models depending on the operational latency and reasoning complexity:

| Model | Primary Use Case | Key Strength |
| :--- | :--- | :--- |
| **Gemini 1.5 Pro** | Complex reasoning, PDF blueprint extraction, data synthesis, coding tasks. | Large context window (2M tokens), deep reasoning. |
| **Gemini 1.5 Flash** | 24/7 Support chatbots, high-volume classification, email sorting. | Ultra-fast latency, cost-effective API pricing. |

---

## 2. API Authentication & Setup

To authenticate your backend server with Google's APIs, configure your API key as an environment variable.

### Environment Configuration (`.env`)
```bash
GEMINI_API_KEY="AIzaSyYourActualGoogleGeminiApiKeyGoesHere"
```

### Installation
Depending on your backend stack, install the official Google Gen AI SDK:

```bash
# Node.js / TypeScript
npm install @google/genai

# Python
pip install google-genai
```

---

## 3. Basic SDK Usage (Python Example)

Below is the standard setup for invoking Gemini with system instructions:

```python
import os
from google import genai
from google.genai import types

# Initialize client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Invoke model
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Summarize this lead: Name: John Doe, Email: john@example.com, looking for a 3-bedroom property.',
    config=types.GenerateContentConfig(
        system_instruction="You are a professional real estate assistant. Extract key details clean and concisely.",
        temperature=0.2,
        top_p=0.9,
    )
)

print(response.text)
```

---

## 4. Structured JSON Outputs (Critical for Agents)

AI Agents need structured data (JSON) rather than free text to execute tool calls (e.g., booking a calendar slot). Gemini supports enforcing JSON schemas natively:

```python
from pydantic import BaseModel, Field

# Define schema
class PropertyBooking(BaseModel):
    client_name: str = Field(description="Full name of the client")
    property_address: str = Field(description="Address of the property")
    requested_date: str = Field(description="ISO 8601 Date string for viewing slot")
    notes: str = Field(description="Any extra details like budget or criteria")

# Generate structured content
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents="John Doe wants to view 1024 Bluebird Lane tomorrow at 2 PM. Budget is $900k.",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=PropertyBooking,
        temperature=0.0
    ),
)

print(response.text)
# Output: {"client_name": "John Doe", "property_address": "1024 Bluebird Lane", "requested_date": "2026-06-10T14:00:00", "notes": "Budget is $900k"}
```

---

## 5. Security & Safety Settings

When deploying agents in customer-facing roles, configure safety thresholds to prevent inappropriate outputs:

```python
safety_settings = [
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    )
]
```
