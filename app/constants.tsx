import { Shield, Trash2, Globe, Settings } from 'lucide-react';
import { FAQItem, FeatureItem, PricingPlan } from './../types';

export const FEATURES: FeatureItem[] = [
  {
    title: "Bad ISPs",
    description: "Check IPs against known harmful ISPs and datacenters often used by bots.",
    icon: Shield
  },
  {
    title: "Disposable Emails",
    description: "Detect 150k+ disposable email providers instantly to prevent burner accounts.",
    icon: Trash2
  },
  {
    title: "Bad VPNs & Proxies",
    description: "Identify VPNs, Tor exit nodes, and open proxies to reduce fraud risk.",
    icon: Globe
  },
  {
    title: "Custom Blacklists",
    description: "Add your own blacklist rules and automatically scan new signups against them.",
    icon: Settings
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How does LOGINGATE prevent fake accounts?",
    answer: "We use a combination of predatory behavior analysis, real-time DNS checks, and advanced algorithms to identify and flag disposable addresses, known bad IPs, and fraudulent patterns before they enter your database."
  },
  {
    question: "Will this affect legitimate users?",
    answer: "LOGINGATE is designed to minimize false positives. Our checks are highly accurate, and you can configure risk thresholds to ensure legitimate users are never impacted."
  },
  {
    question: "Can I customize protection levels?",
    answer: "Yes. You can adjust the strictness of checks, whitelist specific domains, and customize which types of threats (VPN, Disposable, etc.) you want to block."
  },
  {
    question: "How easy is the integration?",
    answer: "Integration takes less than 5 minutes. Simply make a GET request to our API endpoint with the email address you want to verify. We provide SDKs for Node.js and Python."
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Monthly",
    priceMonthly: 9,
    priceYearly: 99, // Placeholder logic handle in component
    limit: "10,000 checks/month",
    features: [
      "Real-time API Access",
      "Disposable Email Detection",
      "Basic Support",
      "99.8% Uptime SLA"
    ]
  },
  {
    name: "Yearly",
    priceMonthly: 49,
    priceYearly: 588, // Placeholder
    limit: "100,000 checks/year",
    recommended: true,
    features: [
      "Priority Support",
      "Advanced VPN Detection",
      "Custom Blacklists",
      "Webhooks",
      "Dedicated Account Manager"
    ]
  }
];