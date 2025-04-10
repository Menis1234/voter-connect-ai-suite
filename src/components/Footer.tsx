import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-4 px-6 text-muted-foreground text-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Version Info */}
        <div>
          VoterOS v1.0.2
        </div>

        {/* Support/Contact */}
        <div>
          Need help?{" "}
          <a
            href="mailto:dm328432@gmail.com"
            className="text-primary hover:underline"
          >
            dm328432@gmail.com
          </a>
        </div>

        {/* Copyright */}
        <div>
          © 2025 DC InnoTech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;