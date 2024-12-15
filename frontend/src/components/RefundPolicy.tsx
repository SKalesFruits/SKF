import React from "react";
import { PolicyPage } from "./PolicyPage";

export const RefundPolicy = () => {
  const content = `
    <p>We aim for 100% satisfaction. If you’re unhappy with your purchase, here’s our refund process:</p>
    <ul class="list-disc pl-5">
      <li>Requests for refunds must be made within 7 days of delivery.</li>
      <li>Fruits must be unused and in their original packaging.</li>
      <li>Refunds will be processed within 3-5 business days.</li>
    </ul>
    <p>Contact support for assistance with refunds.</p>
  `;

  return <PolicyPage title="Refund Policy" content={content} />;
};
