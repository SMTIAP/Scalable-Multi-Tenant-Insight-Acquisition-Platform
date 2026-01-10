import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DataAnalysis.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import surveyData from '../assets/data.json';

const DataAnalysisPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ... existing initialization ...

    const runAnalysis = async () => {
        // ... existing function ...
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        setError(null);
        setSummary(null);
        setKeywords([]);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("VITE_GEMINI_API_KEY is not set in environment variables.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Combine all responses into a single text block
            const allText = surveyData.map((item, index) => `Response ${index + 1}: "${item.text}"`).join('\n');

            const prompt = `
                Analyze the following list of survey responses. 
                1. Provide a concise summary of the overall feedback.
                2. Identify the top 5 most important recurring keywords or topics and estimate their frequency/count based on the text.

                Return a purely JSON object (no markdown formatting, no code fence) with the following structure:
                {
                    "summary": "A 1-2 sentence summary of the overall sentiment and feedback.",
                    "top_5_keywords": [
                        {"keyword": "Quality", "count": 15},
                        {"keyword": "Support", "count": 8}
                    ]
                }

                Survey Data:
                ${allText}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let textResponse = response.text();
            
            // Cleanup if model adds markdown
            textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const analysis = JSON.parse(textResponse);
            
            setSummary(analysis.summary);
            setKeywords(analysis.top_5_keywords);

        } catch (error: any) {
            console.error("Analysis failed:", error);
            setError(error.message || "An unexpected error occurred during analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Helper to get color for keyword index
    const getKeywordColor = (index: number) => {
        const colors = [
            { bg: '#e3f2fd', text: '#1565c0' }, // Blue
            { bg: '#e8f5e9', text: '#2e7d32' }, // Green
            { bg: '#fff3e0', text: '#ef6c00' }, // Orange
            { bg: '#f3e5f5', text: '#7b1fa2' }, // Purple
            { bg: '#ffebee', text: '#c62828' }, // Red
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="data-analysis-container">
            <header className="analysis-header">
                <button className="back-button" onClick={() => navigate('/poc-hub')}>
                    ← Back to POC Hub
                </button>
                <h1>Data Analysis Hub</h1>
                <p>Execute advanced insight acquisition algorithms.</p>
            </header>
            
            <div className="controls-section">
                <button 
                    className="run-btn" 
                    onClick={runAnalysis} 
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? 'Processing...' : 'Run Analysis'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {(summary || keywords.length > 0) && (
                <div className="analysis-report-card">
                    <div className="report-section">
                        <h2>Analysis Summary</h2>
                        <p className="summary-text">{summary}</p>
                    </div>

                    <div className="report-section">
                        <h2>Top Keywords</h2>
                        <div className="keywords-chips">
                            {keywords.map((item: any, index) => {
                                const style = getKeywordColor(index);
                                return (
                                    <span 
                                        key={index} 
                                        className="keyword-chip"
                                        style={{ backgroundColor: style.bg, color: style.text }}
                                    >
                                        {item.keyword} ({item.count})
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataAnalysisPage;
