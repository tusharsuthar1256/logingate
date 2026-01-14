import React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  limit: string;
  features: string[];
  recommended?: boolean;
}