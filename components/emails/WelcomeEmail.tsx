import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
    Column,
    Row,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    firstName: string;
}

export const WelcomeEmail = ({
    firstName,
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to LOGINGATE - Your Email Shield</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome to LOGINGATE, {firstName}! 🚀</Heading>
                <Text style={text}>
                    We're thrilled to have you on board. LOGINGATE is your ultimate shield against fraudulent signups and disposable emails.
                </Text>
                <Section style={box}>
                    <Heading as="h3" style={h3}>Quick Start Features:</Heading>
                    <ul style={list}>
                        <li style={listItem}><strong>Real-time Verification:</strong> Integrate our API to verify emails instantly.</li>
                        <li style={listItem}><strong>Smart Webhooks:</strong> Get notified on your server when threats are detected.</li>
                        <li style={listItem}><strong>Custom Blocklists:</strong> Add and manage your own disposable domain lists.</li>
                        <li style={listItem}><strong>Detailed Analytics:</strong> Monitor your traffic and threat distribution.</li>
                    </ul>
                </Section>
                <Text style={text}>
                    To get started, head over to your <Link href="http://localhost:3000/dashboard" style={link}>Dashboard</Link> and generate your first API key.
                </Text>
                <Hr style={hr} />
                <Text style={footerText}>Stay secure,<br />The LOGINGATE Team</Text>
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
    color: '#00f2ff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const h3 = {
    color: '#ffffff',
    fontSize: '18px',
    margin: '0 0 15px',
};

const text = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '26px',
};

const box = {
    backgroundColor: '#111111',
    padding: '20px',
    borderRadius: '12px',
    margin: '25px 0',
};

const list = {
    paddingLeft: '20px',
    margin: '0',
};

const listItem = {
    color: '#cccccc',
    fontSize: '15px',
    margin: '10px 0',
};

const link = {
    color: '#00f2ff',
    textDecoration: 'none',
    fontWeight: 'bold',
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

