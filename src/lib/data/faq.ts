export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'How accurate is the visualizer compared to the real door?',
    answer:
      'The visualizer renders the exact laminate texture, sheen, and grain direction mapped onto your chosen door model, so what you see on screen closely matches the finished product. Minor variations in wood grain are natural and expected with any real timber door.',
  },
  {
    question: 'Do I need an account to enquire or use the visualizer?',
    answer:
      'No. You can browse doors and laminates, use the visualizer, and submit an enquiry without creating an account. We only ask for your name and phone number so our team can follow up.',
  },
  {
    question: 'Which cities do you deliver and install in?',
    answer:
      'We currently manufacture and deliver across Gujarat, with installation support in major cities. Share your location in the enquiry form and our team will confirm availability and timelines.',
  },
  {
    question: 'Can I request a custom size or laminate not listed on the site?',
    answer:
      'Yes. Our catalogue shows standard sizes and finishes, but most doors can be customized. Mention your requirement in the enquiry form or call us directly and we will confirm feasibility.',
  },
  {
    question: 'What is the typical turnaround time from order to installation?',
    answer:
      'Standard sizes typically take 2–3 weeks from confirmation to installation. Custom sizes or finishes may take longer. Our team will give you an exact timeline once your order is confirmed.',
  },
  {
    question: 'Are your doors treated for termites and moisture?',
    answer:
      "Yes, all our doors go through a chemical treatment process for termite and borer resistance, and our construction is engineered to hold up in Gujarat's climate.",
  },
];
