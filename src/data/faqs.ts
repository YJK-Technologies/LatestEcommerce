export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Orders & Tracking',
    question: 'How do I track my delivery in real-time?',
    answer: 'You can track all active orders under "My Orders". Each order contains an interactive live timeline with airway bill tracking, estimated arrival times, and delivery agent contact details.',
  },
  {
    id: 'faq-2',
    category: 'Orders & Tracking',
    question: 'Can I change my delivery address after placing an order?',
    answer: 'Delivery addresses can be updated within 60 minutes of placing the order as long as the status is "Order Placed" or "Confirmed". Once shipped, our logistics team cannot reroute parcels.',
  },
  {
    id: 'faq-3',
    category: 'Returns & Refunds',
    question: 'What is AURA’s return and replacement policy?',
    answer: 'We provide a hassle-free 10-day return or exchange policy for fashion, luxury items, and eligible electronics. High-value electronics and watches include doorstep technician pickup and instant refund initiation upon collection.',
  },
  {
    id: 'faq-4',
    category: 'Returns & Refunds',
    question: 'How long does it take for a refund to reflect in my bank account?',
    answer: 'UPI and net banking refunds are credited within 2 to 4 business hours. Credit and debit card refunds usually take 2 to 5 banking days depending on your issuing bank.',
  },
  {
    id: 'faq-5',
    category: 'Payments & Offers',
    question: 'What payment methods does AURA support?',
    answer: 'We support all major payment instruments: Instant UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, MasterCard, Amex, RuPay), Net Banking across 50+ banks, EMI on credit cards, and Cash on Delivery (COD).',
  },
  {
    id: 'faq-6',
    category: 'Payments & Offers',
    question: 'How do I apply coupon codes at checkout?',
    answer: 'In the cart or checkout summary screen, browse available coupons or type your promotional code into the "Apply Coupon" input field and click Apply. The discount will instantly recalculate.',
  },
  {
    id: 'faq-7',
    category: 'Authenticity & Warranty',
    question: 'Are all products 100% genuine and covered by manufacturer warranty?',
    answer: 'Yes. Every brand on AURA is direct-sourced from authorized brand houses or direct manufacturers. All electronics, luxury watches, and appliances carry official manufacturer warranties and digital tax invoices.',
  },
];
