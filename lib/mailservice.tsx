'use server'

import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { AlertEmail } from '@/components/emails/AlertEmail';
import React from 'react';

const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY is missing. Email features will be disabled.");
        return null;
    }
    return new Resend(apiKey);
};

const resend = getResendClient();
const FROM_EMAIL = 'LOGINGATE <contact@contact.logingate.live>'; // Using the verified domain provided by user

export const sendWelcomeEmail = async (toEmail: string, firstName: string) => {
    try {
        if (!resend) {
            console.error("Resend client is not initialized. Cannot send welcome email.");
            return { success: false, error: "Email service unconfigured" };
        }
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [toEmail],
            subject: 'Welcome to LOGINGATE - Your Email Shield',
            react: <WelcomeEmail firstName={firstName} />,
        });

        if (error) {
            console.error("Welcome email error:", error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error("Welcome email exception:", err);
        return { success: false, error: err };
    }
};

export const sendAlertEmail = async (toEmail: string, details: { email: string, riskScore: number, threatType: string }) => {
    try {
        if (!resend) {
            console.error("Resend client is not initialized. Cannot send alert email.");
            return { success: false, error: "Email service unconfigured" };
        }
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [toEmail],
            subject: '⚠️ Security Alert: High Risk Email Detected',
            react: <AlertEmail
                email={details.email}
                riskScore={details.riskScore}
                threatType={details.threatType}
            />,
        });

        if (error) {
            console.error("Alert email error:", error);
            return { success: false, error };
        }
        return { success: true, data };
    } catch (err) {
        console.error("Alert email exception:", err);
        return { success: false, error: err };
    }
};

