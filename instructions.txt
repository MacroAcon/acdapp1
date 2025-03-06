This project is an interactive AI-powered portfolio showcasing real-time data analysis for hiring managers in consulting, logistics, and marketing. Instead of static projects, it offers a self-service analytics platform where users interact with datasets and AI-generated insights. This highlights expertise in:

AI-driven workflows

Automated analytics pipelines

Real-time business intelligence

Cost-efficient model deployment

Objectives

Demonstrate Technical Skills – Showcase expertise in FastAPI, AG2 (AutoGen 2.0), OpenAI’s API, React, and data visualization.

Create an Interactive Experience – Allow users to select datasets and receive AI-driven insights.

Optimize for Cost – Implement a token limiter to control OpenAI API usage.

Leverage AI Agents – Use AG2 to simulate a collaborative AI analysis team.

Ensure Scalability – Deploy a lightweight, cost-efficient solution (GitHub Pages for frontend, FastAPI for backend).

Implementation Strategy

Tech Stack

Backend: FastAPI (Python) for AI agent workflows.

Frontend: React for dynamic UI interactions.

AI Framework: AG2 (AutoGen 2.0) for multi-agent collaboration.

Database: Preloaded datasets (potential future cloud integration).

Deployment: GitHub Pages (frontend), cloud-based FastAPI backend.

AI Agent Workflow

Supervisor Agent (chatgpt-4o-latest) – Oversees workflow, delegates tasks.

Data Analysis Agent (o3-mini) – Processes datasets, extracts insights.

Visualization Agent (o3-mini) – Generates interactive charts.

Narrative Insights Agent (chatgpt-4o-latest) – Converts findings into a business-friendly summary.

QA Agent (o3-mini) – Reviews responses for clarity and correctness.

User Flow

User selects a dataset and enters a query (e.g., "How can we improve warehouse efficiency?").

Supervisor delegates tasks:

Data Analysis Agent processes the dataset.

Visualization Agent generates charts.

Narrative Insights Agent creates a business summary.

QA Agent ensures quality before returning results.

Frontend displays insights, visualizations, and estimated API cost.

Token Usage Control

Tracks token consumption per API call.

Daily usage cap ensures API costs remain within OpenAI’s free tier.

Live token cost estimates shown to users for transparency.