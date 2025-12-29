import type { SubscriptionPlan } from '../types';

export const mockSubscriptions: SubscriptionPlan[] = [
  // Individual Plans
  {
    id: 'ind_weekly',
    name: 'Weekly Plan',
    price: 7.99,
    period: 'week',
    type: 'individual',
    features: [
      'Unlimited Chat Consultations',
      '1 Video Call/week',
      '5% off prescriptions',
    ],
  },
  {
    id: 'ind_monthly',
    name: 'Monthly Plan',
    price: 19.99,
    period: 'month',
    type: 'individual',
    features: [
      'Unlimited Chat Consultations',
      '4 Video Calls/month',
      '10% off prescriptions',
      'Priority Support',
    ],
    isPopular: true,
  },
  {
    id: 'ind_yearly',
    name: 'Yearly Plan',
    price: 199.99,
    period: 'year',
    type: 'individual',
    features: [
      'Unlimited Chat & Video Calls',
      '20% off prescriptions',
      'Priority Support',
      'Annual Health Check-up',
    ],
  },
  // Corporate Plans
  {
    id: 'corp_weekly',
    name: 'Weekly Pass',
    price: 59.99,
    period: 'week',
    type: 'corporate',
    features: [
      'For teams up to 10 members',
      'Unlimited Chat Consultations',
      '5 team video calls/week',
    ],
  },
  {
    id: 'corp_monthly',
    name: 'Business Monthly',
    price: 249.99,
    period: 'month',
    type: 'corporate',
    features: [
      'For teams up to 25 members',
      'Unlimited Chat Consultations',
      '20 team video calls/month',
      'Dedicated Account Manager',
    ],
    isPopular: true,
  },
  {
    id: 'corp_yearly',
    name: 'Enterprise Yearly',
    price: 2499.99,
    period: 'year',
    type: 'corporate',
    features: [
      'For teams up to 50 members',
      'Unlimited Chat & Video Calls',
      'On-site Health Workshops',
      'Advanced Analytics Dashboard',
    ],
  },
];
