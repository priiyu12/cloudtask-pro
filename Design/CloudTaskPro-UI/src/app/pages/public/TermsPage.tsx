import { motion } from "motion/react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `Please read these Terms of Service carefully before using CloudTask Pro. These terms govern your access to and use of our project management platform, APIs, and related services. By using our Services, you agree to be bound by these terms.

If you are using our Services on behalf of an organization, you agree to these Terms on behalf of that organization. If you do not agree to these Terms, do not use our Services.`,
  },
  {
    title: "2. Account Registration",
    content: `To use most features of CloudTask Pro, you must create an account. When you register, you agree to:

• Provide accurate, current, and complete information
• Maintain the security of your account credentials
• Accept responsibility for all activities that occur under your account
• Notify us immediately of any unauthorized access to your account

You must be at least 16 years old to create an account. If you are under 18, you must have your parent or guardian's permission.`,
  },
  {
    title: "3. Subscription Plans and Billing",
    content: `CloudTask Pro offers free and paid subscription plans. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring basis.

Billing terms:
• Subscriptions renew automatically unless cancelled before the renewal date
• You may cancel your subscription at any time through your account settings
• Refunds are available within 14 days of your initial purchase or annual renewal
• Price changes will be communicated with at least 30 days notice

Failure to pay may result in suspension or termination of your account.`,
  },
  {
    title: "4. Permitted Use",
    content: `You may use CloudTask Pro only for lawful purposes and in accordance with these Terms. You agree not to:

• Use the Services for any unlawful purpose or in violation of any regulations
• Transmit viruses, malware, or any other harmful or disruptive code
• Attempt to gain unauthorized access to our systems or other users' accounts
• Reverse engineer, decompile, or disassemble any portion of the Services
• Use the Services to send spam or engage in phishing
• Scrape or crawl our Services without express written permission
• Resell or sublicense access to the Services without authorization`,
  },
  {
    title: "5. Intellectual Property",
    content: `CloudTask Pro and its licensors own all intellectual property rights in the Services, including software, design, text, graphics, and trademarks. Nothing in these Terms grants you any right to use CloudTask Pro's trademarks, logos, or brand features.

Your content remains yours. By uploading or creating content in CloudTask Pro, you grant us a limited, non-exclusive license to use, store, and display that content solely as necessary to provide the Services to you.`,
  },
  {
    title: "6. Privacy and Data",
    content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Services, you consent to the collection and use of information as described in our Privacy Policy.

We implement appropriate technical and organizational measures to protect your data. For enterprise customers, we offer Data Processing Agreements (DPAs) that govern our processing of personal data on your behalf.`,
  },
  {
    title: "7. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, CloudTask Pro and its affiliates, officers, employees, agents, and licensors shall not be liable for:

• Any indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, business, or goodwill
• Service interruptions or system failures
• Unauthorized access to or alteration of your data

Our total liability to you for any claims arising from these Terms or your use of the Services shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: "8. Termination",
    content: `Either party may terminate this agreement at any time. You may terminate by closing your account through Settings. We may terminate or suspend your account immediately, without prior notice, if:

• You breach these Terms
• We are required to do so by law
• We reasonably believe your account has been compromised
• Your account has been inactive for more than 24 months

Upon termination, your right to use the Services will immediately cease. We will provide you with a 30-day window to export your data before it is permanently deleted.`,
  },
  {
    title: "9. Governing Law and Disputes",
    content: `These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.

Any disputes arising from these Terms or your use of the Services will be resolved through binding arbitration under the American Arbitration Association's Commercial Arbitration Rules, rather than in court, except that you may assert claims in small claims court if your claims qualify.

By accepting these Terms, you waive your right to a jury trial and to participate in a class action lawsuit. If you have any questions about these Terms, please contact us at legal@cloudtaskpro.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <p className="text-white/30 text-sm mb-2">Effective date: June 1, 2025</p>
            <h1 className="text-4xl font-extrabold mb-4">Terms of Service</h1>
            <p className="text-white/60 leading-relaxed">
              Please read these Terms of Service carefully before using CloudTask Pro. These terms govern your
              access to and use of our project management platform, APIs, and related services.
            </p>
          </div>

          {/* Quick nav */}
          <div className="mb-10 p-5 rounded-2xl border border-white/10 bg-white/3">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Contents</p>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {sections.map(({ title }, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {title}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {sections.map(({ title, content }, i) => (
              <motion.section
                key={title}
                id={`section-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
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
              Questions about these Terms?{" "}
              <a href="mailto:legal@cloudtaskpro.com" className="text-[#0EA5E9] hover:underline">
                Contact our legal team
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
