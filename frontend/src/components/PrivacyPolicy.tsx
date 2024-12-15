import React from "react";
import { PolicyPage } from "./PolicyPage";

export const PrivacyPolicy = () => {
  const content = `
    <p>Your privacy is important to us. Here's how we handle your information:</p>
    <ul class="list-disc pl-5">
      <li>We collect only necessary information for your orders.</li>
      <li>Your data is stored securely and not shared with third parties.</li>
      <li>You can request to delete your data at any time.</li>
    </ul>
    <p>Read our full privacy policy for more details.</p>
  `;

  return <PolicyPage title="Privacy Policy" content={content} />;
};
