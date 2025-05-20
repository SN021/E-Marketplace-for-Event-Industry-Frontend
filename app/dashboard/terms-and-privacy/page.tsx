import React from "react";

export default function TermsAndPrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-sm md:text-base text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Terms & Conditions
      </h1>

      <p className="mb-4">
        Welcome to our platform. These Terms & Conditions (“Terms”) govern your
        use of our services and website. By accessing or using the platform, you
        agree to be bound by these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Platform Overview</h2>
      <p className="mb-4">
        We provide a digital e-marketplace that connects clients with event
        service providers (vendors) across Sri Lanka. The platform allows
        vendors to showcase their services and clients to request quotes,
        communicate, and book services securely.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. Vendor Responsibilities
      </h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          Provide accurate service information, pricing, and availability.
        </li>
        <li>Respond to client queries promptly and professionally.</li>
        <li>Fulfil all confirmed bookings with quality service.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Commission and Payments
      </h2>
      <p className="mb-4">
        Vendors agree to pay a <strong>7% commission</strong> on the final
        transaction value of every successful booking processed through the
        platform. This amount is automatically deducted prior to vendor payout.
        Vendors must comply with local tax regulations.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Client Responsibilities
      </h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Provide accurate event details and contact information.</li>
        <li>Respond to vendor communications promptly.</li>
        <li>Abide by cancellation and refund policies.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Booking and Cancellation
      </h2>
      <p className="mb-4">
        All bookings are subject to vendor availability. Cancellation policies
        are defined by vendors and must be respected by clients. We are not
        liable for disputes, delays, or service issues, but we do provide a
        dispute resolution mechanism.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not responsible for the actions or omissions of vendors or
        clients. The platform merely facilitates connections between users.
      </p>

      <hr className="my-10 border-gray-300" />

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy outlines how we
        collect, use, and protect your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong>Clients:</strong> Name, email, contact details, event info.
        </li>
        <li>
          <strong>Vendors:</strong> Business name, services, pricing, ID info.
        </li>
        <li>
          <strong>General:</strong> Messages, feedback, and payment records.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Use of Data</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>To match clients with suitable vendors</li>
        <li>To process bookings and payments</li>
        <li>To improve platform performance and provide support</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Security</h2>
      <p className="mb-4">
        We use secure authentication, encryption (at rest and in transit), and
        access control. Your data is never sold or publicly shared.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Retention</h2>
      <p className="mb-4">
        We retain data only as long as necessary to provide services and meet
        legal obligations. You can request deletion at any time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Cookies</h2>
      <p className="mb-4">
        We use cookies to manage sessions, improve UX, and analyse platform
        usage. You can disable cookies but some features may not work correctly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Request access to your data</li>
        <li>Correct inaccurate information</li>
        <li>Delete your account and personal data</li>
      </ul>

      <p className="mt-10 text-gray-500">
        For questions regarding this policy, contact us at{" "}
        <a
          href="mailto:support@venzor.com"
          className="text-blue-600 underline"
        >
          support@venzor.com
        </a>
        .
      </p>
    </div>
  );
}
