import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/problems`);
        setProblem(res.data.find(p => p._id === id));
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    setSubmitting(true);
    
    try {
      const res = await axios.post(
        `http://localhost:5000/api/submit/${id}`,
        { code, language: "python3" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(res.data.results);
    } catch (err) {
      console.error("Submission error: ", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to normalize results for comparison
  const normalizeResult = (result) => {
    if (typeof result === 'string') {
      try {
        // Try to parse and stringify to normalize formatting
        const parsed = JSON.parse(result);
        return JSON.stringify(parsed);
      } catch {
        // If not valid JSON, just trim whitespace and normalize spacing
        return result.trim().replace(/\s+/g, ' ');
      }
    }
    return result;
  };

  // Function to check if results are actually equal
  const areResultsEqual = (expected, received) => {
    try {
      const normalizedExpected = normalizeResult(expected);
      const normalizedReceived = normalizeResult(received);
      return normalizedExpected === normalizedReceived;
    } catch {
      return false;
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const wrapperStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '1rem'
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    height: 'fit-content'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '0.5rem'
  };

  const descriptionStyle = {
    color: '#374151',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-wrap'
  };

  const codeAreaStyle = {
    width: '100%',
    minHeight: '400px',
    padding: '1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const buttonStyle = {
    padding: '0.75rem 2rem',
    backgroundColor: submitting ? '#9ca3af' : '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: submitting ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s ease',
    marginTop: '1rem',
    display: 'block',
    width: '100%'
  };

  const resultsStyle = {
    marginTop: '2rem'
  };

  const resultsHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const resultItemStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
  };

  const passStyle = {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    color: '#166534'
  };

  const failStyle = {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    color: '#dc2626'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    fontSize: '1.2rem',
    color: '#6b7280'
  };

  const singleColumnStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const handleCodeareaFocus = (e) => {
    e.target.style.borderColor = '#059669';
  };

  const handleCodeareaBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb';
  };

  const handleButtonHover = (e) => {
    if (!submitting) {
      e.target.style.backgroundColor = '#047857';
    }
  };

  const handleButtonLeave = (e) => {
    if (!submitting) {
      e.target.style.backgroundColor = '#059669';
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          Loading problem...
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          Problem not found
        </div>
      </div>
    );
  }

  // Check for mobile/tablet view
  const isMobile = window.innerWidth <= 768;
  const currentWrapperStyle = isMobile ? singleColumnStyle : wrapperStyle;

  // Calculate actual pass count considering normalized results
  const actualPassCount = results.filter(r => r.pass || areResultsEqual(r.expected, r.received)).length;
  const allTestsPassed = actualPassCount === results.length && results.length > 0;

  return (
    <div style={containerStyle}>
      <div style={currentWrapperStyle}>
        {/* Problem Description */}
        <div style={cardStyle}>
          <h2 style={titleStyle}>{problem.title}</h2>
          <div style={descriptionStyle}>{problem.description}</div>
        </div>

        {/* Code Editor and Results */}
        <div style={cardStyle}>
          <h3 style={{ ...resultsHeaderStyle, marginBottom: '1rem' }}>Solution</h3>
          
          <textarea
            rows="20"
            value={code}
            onChange={e => setCode(e.target.value)}
            onFocus={handleCodeareaFocus}
            onBlur={handleCodeareaBlur}
            style={codeAreaStyle}
            placeholder="# Write your Python solution here..."
          />
          
          <button
            onClick={handleSubmit}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            style={buttonStyle}
            disabled={submitting || !code.trim()}
          >
            {submitting ? 'Running Tests...' : 'Submit Solution'}
          </button>

          {results.length > 0 && (
            <div style={resultsStyle}>
              <div style={resultsHeaderStyle}>
                <span>Test Results</span>
                <span style={{
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: allTestsPassed ? '#dcfce7' : '#fee2e2',
                  color: allTestsPassed ? '#166534' : '#dc2626'
                }}>
                  {actualPassCount}/{results.length} Passed
                </span>
              </div>
              
              <div>
                {results.map((r, idx) => {
                  // Override the pass status if results are actually equal
                  const actualPass = r.pass || areResultsEqual(r.expected, r.received);
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        ...resultItemStyle,
                        ...(actualPass ? passStyle : failStyle)
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        Test Case {idx + 1}: {actualPass ? '✅ PASS' : '❌ FAIL'}
                      </div>
                      <div><strong>Input:</strong> {r.input}</div>
                      <div><strong>Expected:</strong> {r.expected}</div>
                      <div><strong>Got:</strong> {r.received.trim()}</div>
                      {!r.pass && actualPass && (
                        <div style={{ 
                          marginTop: '0.5rem', 
                          fontSize: '0.8rem', 
                          color: '#059669',
                          fontStyle: 'italic' 
                        }}>
                          ✓ Results match (formatting difference only)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;