import * as React from 'react';

interface AlertEmailProps {
    email: string;
    riskScore: number;
    threatType: string;
}

export const AlertEmail = ({
    email,
    riskScore,
    threatType,
}: AlertEmailProps) => (
    <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: '12px',
        border: '1px solid #ff4b4b'
    }}>
        <h1 style={{ color: '#ff4b4b' }}>⚠️ High Risk Email Detected!</h1>
        <p>We just identified a high-risk signup attempt on your platform.</p>
        <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: '5px 0' }}><strong>Risk Score:</strong> <span style={{ color: '#ff4b4b' }}>{riskScore}/100</span></p>
            <p style={{ margin: '5px 0' }}><strong>Threat Type:</strong> {threatType}</p>
        </div>
        <p style={{ marginTop: '20px' }}>Your configured <strong>Fraud Mitigation</strong> actions have been triggered. You can review more details in your API logs.</p>
        <p>Stay vigilant,<br />LOGINGATE Security Bot</p>
    </div>
);
