import * as React from 'react';

interface WelcomeEmailProps {
    firstName: string;
}

export const WelcomeEmail = ({
    firstName,
}: WelcomeEmailProps) => (
    <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '12px'
    }}>
        <h1 style={{ color: '#00f2ff' }}>Welcome to LOGINGATE, {firstName}! 🚀</h1>
        <p>We're thrilled to have you on board. LOGINGATE is your ultimate shield against fraudulent signups and disposable emails.</p>
        <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Quick Start Features:</h3>
            <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Real-time Verification:</strong> Integrate our API to verify emails instantly.</li>
                <li><strong>Smart Webhooks:</strong> Get notified on your server when threats are detected.</li>
                <li><strong>Custom Blocklists:</strong> Add and manage your own disposable domain lists.</li>
                <li><strong>Detailed Analytics:</strong> Monitor your traffic and threat distribution.</li>
            </ul>
        </div>
        <p style={{ marginTop: '20px' }}>To get started, head over to your <a href="http://localhost:3000/dashboard" style={{ color: '#00f2ff' }}>Dashboard</a> and generate your first API key.</p>
        <p>Stay secure,<br />The LOGINGATE Team</p>
    </div>
);
