# AI-Powered Analytics Platform

An interactive AI-powered portfolio project showcasing real-time data analysis capabilities using FastAPI, AutoGen, and React. This platform demonstrates expertise in AI-driven workflows, automated analytics pipelines, and real-time business intelligence.

## Features

- 🤖 Multi-Agent AI Analysis
- 📊 Interactive Data Visualization
- 💰 Real-time Cost Estimation
- 📈 Token Usage Monitoring
- 🔄 Automated Insights Generation
- 🛡️ Built-in Rate Limiting

## Tech Stack

### Backend
- FastAPI (Python)
- AutoGen for AI Agents
- OpenAI API
- Pandas & NumPy for Data Processing
- Plotly for Visualization

### Frontend
- React with TypeScript
- Material-UI Components
- TanStack Query
- Recharts for Charts
- Axios for API Communication

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:

   On Windows (PowerShell):
   ```powershell
   python -m venv venv
   # If you get a security error, first run:
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   # Then activate the virtual environment:
   .\venv\Scripts\Activate.ps1
   ```

   On Unix/MacOS:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:
   ```bash
   cp .env.example .env  # On Windows: copy .env.example .env
   ```
   Then edit `.env` and add your OpenAI API key.

5. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Access the web interface at `http://localhost:3000`
2. Upload a dataset (CSV, Excel, or JSON)
3. Enter your analysis query
4. View the AI-generated insights and visualizations
5. Monitor token usage and costs

## Sample Queries

Try these example queries with the sample dataset:

- "Analyze the sales trends across different regions"
- "What are the key factors affecting delivery times?"
- "Identify opportunities for optimizing shipping costs"
- "Compare performance between product categories"

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── agents/         # AI agent implementations
│   │   ├── api/           # FastAPI routes
│   │   ├── core/          # Core functionality
│   │   └── main.py        # Application entry point
│   ├── sample_data/       # Test datasets
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API services
    │   └── App.tsx        # Main application
    └── package.json
```

## Token Usage and Costs

The platform includes built-in token tracking and cost estimation:

- Daily usage limits prevent unexpected costs
- Real-time cost estimates per analysis
- Usage history tracking
- Automatic daily reset of usage counters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.