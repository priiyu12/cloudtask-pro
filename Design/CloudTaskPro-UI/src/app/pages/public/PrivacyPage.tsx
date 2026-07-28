import { motion } from "motion/react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This includes your name, email address, payment information, and any other information you choose to provide.

We also collect information automatically when you use CloudTask Pro, including log data (IP address, browser type, pages visited), device information, and usage data. We use cookies and similar tracking technologies to collect this information.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information, including purchase confirmations and invoices
• Send technical notices, updates, security alerts, and support and administrative messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities in connection with our services
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Personalize your experience and deliver content and product features relevant to your interests
• Facilitate contests, sweepstakes, and promotions`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except as described in this Privacy Policy.

We may share your information with:

• Service providers who assist us in operating our website and providing services
• Business partners who provide complementary services with your permission
• Law enforcement or other third parties when required by applicable law or legal process
• Other parties in connection with company transactions such as mergers, acquisitions, or asset sales

In such cases, we will require those parties to maintain the confidentiality of your information.`,
  },
  {
    title: "4. Data Retention",
    content: `We retain your information for as long as your account is active or as needed to provide you services. If you close your account, we will delete or anonymize your information within 90 days, unless we are required to retain it for legal purposes.

You may request deletion of your personal data at any time by contacting us at privacy@cloudtaskpro.com. Please note that some information may be retained in backup copies for a limited time.`,
  },
  {
    title: "5. Security",
    content: `We take the security of your data seriously. CloudTask Pro employs industry-standard security measures including:

• AES-256 encryption for data at rest
• TLS 1.3 encryption for data in transit
• SOC 2 Type II certification
• Regular third-party security audits and penetration testing
• Multi-factor authentication options
• Role-based access controls

However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.`,
  },
  {
    title: "6. Your Rights and Choices",
    content: `Depending on your location, you may have certain rights regarding your personal information:

• Access: You can request a copy of the personal data we hold about you
• Correction: You can update or correct inaccurate information through your account settings
• Deletion: You can request deletion of your personal data
• Portability: You can request your data in a structured, machine-readable format
• Objection: You can object to our processing of your personal data in certain circumstances
• Opt-out: You can opt out of marketing communications at any time

To exercise these rights, please contact us at privacy@cloudtaskpro.com.`,
  },
  {
    title: "7. Cookies and Tracking",
    content: `We use cookies and similar tracking technologies to collect usage information. Types of cookies we use:

• Essential cookies: Required for the operation of our website
• Analytics cookies: Help us understand how users interact with our service
• Preference cookies: Remember your settings and preferences
• Marketing cookies: Used to deliver relevant advertisements (only with your consent)

You can control cookies through your browser settings and, where applicable, through our cookie consent manager. Note that disabling certain cookies may affect the functionality of our services.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we will provide a more prominent notice, including email notification for registered users.

Your continued use of CloudTask Pro after any changes to this Privacy Policy constitutes your acceptance of the revised policy. We encourage you to review this Privacy Policy periodically.

If you have any questions about this Privacy Policy, please contact us at privacy@cloudtaskpro.com or write to us at: CloudTask Pro, Inc., 100 Market Street, Suite 300, San Francisco, CA 94105.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <p className="text-white/30 text-sm mb-2">Last updated: June 1, 2025</p>
            <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-white/60 leading-relaxed">
              At CloudTask Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our project management platform and related
              services.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {sections.map(({ title, content }, i) => (
              <motion.section
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
                <div className="text-white/60 text-sm leading-loose whitespace-pre-line">
                  {content}
                </div>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm">
              Have questions about our privacy practices?{" "}
              <a href="mailto:privacy@cloudtaskpro.com" className="text-[#0EA5E9] hover:underline">
                Contact our privacy team
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
