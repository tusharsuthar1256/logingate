import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
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
    <Html>
        <Head />
        <Preview>Security Alert: High Risk Email Detected</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>⚠️ High Risk Email Detected!</Heading>
                <Text style={text}>
                    We just identified a high-risk signup attempt on your platform.
                </Text>
                <Section style={box}>
                    <Text style={detailText}><strong>Email:</strong> {email}</Text>
                    <Text style={detailText}>
                        <strong>Risk Score:</strong> <span style={{ color: '#ff4b4b' }}>{riskScore}/100</span>
                    </Text>
                    <Text style={detailText}><strong>Threat Type:</strong> {threatType}</Text>
                </Section>
                <Hr style={hr} />
                <Text style={footerText}>
                    Your configured <strong>Fraud Mitigation</strong> actions have been triggered. You can review more details in your API logs.
                </Text>
                <Text style={footerText}>Stay vigilant,<br />LOGINGATE Security Bot</Text>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#000000',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#0a0a0a',
    margin: '0 auto',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #333',
};

const h1 = {
    color: '#ff4b4b',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const text = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '24px',
};

const box = {
    backgroundColor: '#111111',
    padding: '20px',
    borderRadius: '8px',
    margin: '25px 0',
};

const detailText = {
    color: '#ffffff',
    fontSize: '15px',
    margin: '8px 0',
};

const hr = {
    borderColor: '#333333',
    margin: '30px 0',
};

const footerText = {
    color: '#888888',
    fontSize: '14px',
    lineHeight: '22px',
};

