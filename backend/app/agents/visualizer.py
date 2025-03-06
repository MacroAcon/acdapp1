import autogen
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, List, Optional
from .base_config import get_agent_config

class VisualizationAgent:
    def __init__(self):
        self.config = get_agent_config("visualizer")
        self.agent = autogen.AssistantAgent(
            name="visualizer",
            system_message="""You are a visualization agent specialized in:
            1. Creating insightful data visualizations
            2. Choosing appropriate chart types for different data types
            3. Optimizing visual representations for clarity
            4. Generating interactive plots
            5. Ensuring accessibility in visualizations
            
            Focus on creating clear, informative, and interactive visualizations that effectively communicate insights.""",
            llm_config=self.config
        )
        
    async def create_visualizations(
        self, 
        analysis_results: Dict[str, Any],
        data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create visualizations based on analysis results and data
        """
        try:
            # Convert data to DataFrame if needed
            df = pd.DataFrame(data["data"]) if isinstance(data.get("data"), list) else data["data"]
            
            visualizations = {
                "plots": [],
                "summary": [],
                "recommendations": []
            }
            
            # Generate visualizations based on data types
            numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
            categorical_cols = df.select_dtypes(include=['object', 'category']).columns
            
            # Create distribution plots for numeric columns
            for col in numeric_cols[:5]:  # Limit to first 5 numeric columns
                fig = self._create_distribution_plot(df, col)
                if fig:
                    visualizations["plots"].append({
                        "type": "distribution",
                        "column": col,
                        "plot_data": fig.to_json()
                    })
            
            # Create bar charts for categorical columns
            for col in categorical_cols[:5]:  # Limit to first 5 categorical columns
                fig = self._create_bar_chart(df, col)
                if fig:
                    visualizations["plots"].append({
                        "type": "bar",
                        "column": col,
                        "plot_data": fig.to_json()
                    })
            
            # If we have both numeric columns, create correlation heatmap
            if len(numeric_cols) > 1:
                fig = self._create_correlation_heatmap(df[numeric_cols])
                if fig:
                    visualizations["plots"].append({
                        "type": "heatmap",
                        "name": "Correlation Heatmap",
                        "plot_data": fig.to_json()
                    })
            
            return {
                "status": "success",
                "visualizations": visualizations,
                "message": "Visualizations created successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "message": "Failed to create visualizations"
            }
    
    def _create_distribution_plot(
        self, 
        df: pd.DataFrame, 
        column: str
    ) -> Optional[go.Figure]:
        """Create a distribution plot for numeric data"""
        try:
            fig = px.histogram(
                df,
                x=column,
                title=f"Distribution of {column}",
                template="plotly_white"
            )
            fig.update_layout(
                showlegend=False,
                xaxis_title=column,
                yaxis_title="Count"
            )
            return fig
        except Exception:
            return None
    
    def _create_bar_chart(
        self, 
        df: pd.DataFrame, 
        column: str
    ) -> Optional[go.Figure]:
        """Create a bar chart for categorical data"""
        try:
            value_counts = df[column].value_counts()
            fig = px.bar(
                x=value_counts.index,
                y=value_counts.values,
                title=f"Distribution of {column}",
                template="plotly_white"
            )
            fig.update_layout(
                xaxis_title=column,
                yaxis_title="Count",
                xaxis_tickangle=-45
            )
            return fig
        except Exception:
            return None
    
    def _create_correlation_heatmap(
        self, 
        df: pd.DataFrame
    ) -> Optional[go.Figure]:
        """Create a correlation heatmap for numeric columns"""
        try:
            corr_matrix = df.corr()
            fig = px.imshow(
                corr_matrix,
                title="Correlation Heatmap",
                template="plotly_white"
            )
            fig.update_layout(
                xaxis_title="Features",
                yaxis_title="Features"
            )
            return fig
        except Exception:
            return None
    
    def get_agent(self) -> autogen.AssistantAgent:
        """Get the underlying AutoGen agent"""
        return self.agent 