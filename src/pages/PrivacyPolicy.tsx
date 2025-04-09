import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient px-4 py-8">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <Link
          to="/register"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 input-transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to registration
        </Link>

        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose prose-blue max-w-none">
          <p className="lead">
            Effective Date: April 8, 2025
          </p>

          <h2>1. Introduction</h2>
          <p>
            Your Company ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our website and services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Personal information such as name, email address, and password when you register</li>
            <li>Information you provide in your profile</li>
            <li>Communications you send to us</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes, including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
          </ul>

          <h2>4. Cookies and Similar Technologies</h2>
          <p>
            We may use cookies and similar technologies to collect information about how you use our services
            and to remember you when you return to our website.
          </p>

          <h2>5. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy.
            We may share your information with:
          </p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>In response to legal process or when required by law</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2>6. Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse,
            unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2>7. Your Choices</h2>
          <p>
            You may update, correct, or delete your account information at any time by logging into your account.
            You may also opt out of receiving promotional emails from us by following the instructions in those emails.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13, and we do not knowingly collect
            personal information from children under 13.
          </p>

          <h2>9. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the effective date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            privacy@yourcompany.com
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/register"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 input-transition"
          >
            Return to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;