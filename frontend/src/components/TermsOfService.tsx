import React from "react";
import { PolicyPage } from "./PolicyPage";

export const TermsOfService = () => {
  const content = `
    <p>Welcome to Fresh Fruits! By using our website, you agree to the following terms:</p>
    <ul class="list-disc pl-5">
      <li>All products are subject to availability.</li>
      <li>Prices are subject to change without prior notice.</li>
      <li>Misuse of our platform may result in account suspension.</li>
    </ul>
    <p>Read our complete terms for detailed information.</p>
  `;

  return <PolicyPage title="Terms of Service" content={content} />;
};
