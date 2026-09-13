export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalPageContent {
  title: string;
  updatedOn: string;
  intro: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalPageContent = {
  title: 'Privacy Policy',
  updatedOn: 'September 2026',
  intro:
    'This Privacy Policy explains how Zellenth collects, uses, and protects information when you use our website and services.',
  sections: [
    {
      heading: 'Information we collect',
      body: [
        'When you submit an enquiry, we collect your name, phone number, and optionally your email address and message so our team can respond to your request.',
        'We collect standard technical information such as browser type and pages visited to help us improve the site. This does not identify you personally.',
      ],
    },
    {
      heading: 'How we use your information',
      body: [
        'We use the information you provide solely to respond to enquiries, share quotes, and coordinate delivery or installation of products you have shown interest in.',
        'We do not sell or rent your personal information to third parties.',
      ],
    },
    {
      heading: 'Data retention',
      body: [
        'We retain enquiry information for as long as necessary to fulfil your request and maintain our business records, after which it may be securely deleted.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        'You can request access to, correction of, or deletion of your personal information at any time by contacting us using the details on our Contact page.',
      ],
    },
    {
      heading: 'Contact us',
      body: [
        'If you have questions about this Privacy Policy, reach out via the Contact page and our team will get back to you.',
      ],
    },
  ],
};

export const termsOfService: LegalPageContent = {
  title: 'Terms of Service',
  updatedOn: 'September 2026',
  intro: 'These Terms of Service govern your use of the Zellenth website and the products we sell.',
  sections: [
    {
      heading: 'Use of the website',
      body: [
        'This website is provided to help you browse our door and laminate catalogue, visualize combinations, and submit enquiries. You agree to use it only for lawful purposes.',
      ],
    },
    {
      heading: 'Product information and pricing',
      body: [
        'Product images, dimensions, and finishes are shown for reference. Actual grain, sheen, and shade may vary slightly due to the natural nature of timber and laminate materials.',
        'Pricing is confirmed directly with our team after an enquiry and is not displayed on the website.',
      ],
    },
    {
      heading: 'Orders and delivery',
      body: [
        'An enquiry submitted through this website is not a confirmed order. Orders are confirmed only after our team has discussed requirements, pricing, and timelines with you directly.',
        'Delivery and installation timelines communicated by our team are estimates and may vary based on customization and location.',
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'Zellenth is not liable for indirect or incidental damages arising from the use of this website. Our liability for any product is limited to repair, replacement, or refund as agreed at the time of sale.',
      ],
    },
    {
      heading: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.',
      ],
    },
  ],
};

export const cookiePolicy: LegalPageContent = {
  title: 'Cookie Policy',
  updatedOn: 'September 2026',
  intro:
    'This Cookie Policy explains how Zellenth uses cookies and similar technologies on this website.',
  sections: [
    {
      heading: 'What are cookies',
      body: [
        'Cookies are small text files stored on your device that help websites function correctly and remember your preferences.',
      ],
    },
    {
      heading: 'How we use cookies',
      body: [
        'We use essential cookies required for the website to function, such as remembering session state while you browse.',
        'We may use analytics cookies to understand how visitors use the site, so we can improve navigation and content.',
      ],
    },
    {
      heading: 'Managing cookies',
      body: [
        'Most browsers let you control or disable cookies through their settings. Disabling essential cookies may affect how parts of the website function.',
      ],
    },
  ],
};
