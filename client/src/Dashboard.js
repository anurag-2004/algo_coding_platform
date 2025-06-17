import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await axios.get('http://localhost:5000/api/problems');
      setProblems(res.data);
    };
    fetchProblems();
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const wrapperStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '2rem'
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e5e7eb'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '2rem 0',
    color: '#6b7280',
    fontSize: '1.1rem'
  };

  const problemItemStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  const linkStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#2563eb',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#f9fafb';
    e.currentTarget.style.borderColor = '#3b82f6';
    const link = e.currentTarget.querySelector('a');
    if (link) {
      link.style.color = '#1d4ed8';
      link.style.textDecoration = 'underline';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'white';
    e.currentTarget.style.borderColor = '#e5e7eb';
    const link = e.currentTarget.querySelector('a');
    if (link) {
      link.style.color = '#2563eb';
      link.style.textDecoration = 'none';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>Problems</h2>
          
          {problems.length === 0 ? (
            <div style={emptyStateStyle}>
              <p>No problems available yet.</p>
            </div>
          ) : (
            <div>
              {problems.map(p => (
                <div
                  key={p._id}
                  style={problemItemStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={`/problem/${p._id}`}
                    style={linkStyle}
                  >
                    {p.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;