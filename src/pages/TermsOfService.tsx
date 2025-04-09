import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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

        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose prose-blue max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Your Company. By using our service, you agree to these Terms of Service.
            Please read them carefully.
          </p>

          <h2>2. Definitions</h2>
          <p>
            "Service" refers to the website and all related services offered by Your Company.
            "User" refers to any individual who accesses or uses the Service.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To use certain features of the Service, you must register for an account.
            You agree to provide accurate, current, and complete information during the
            registration process and to update such information to keep it accurate, current, and complete.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password.
            You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy describes how we collect,
            use, and protect your personal information.
          </p>

          <h2>6. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently,
            the Service with or without notice to you.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice,
            for conduct that we believe violates these Terms of Service or is harmful
            to other users of the Service or third parties.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall Your Company be liable for any indirect, incidental,
            special, consequential or punitive damages, resulting from any use of the Service.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of [Your Country/State], without
            regard to its conflict of law provisions.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide
            notice of any material changes to these Terms.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            support@yourcompany.com
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

export default TermsOfService;