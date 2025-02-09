import React from "react";
import { PolicyPage } from "./PolicyPage";

export const ShippingPolicy = () => {
  const content = `
    <p>At Growफल, we ensure timely delivery of your orders. Our shipping policy is as follows:</p>
    <ul class="list-disc pl-5">
      <li>Orders are processed within 4-5 business days.</li>
      <li>We provide same-day delivery for select locations.</li>
      <li>Shipping fees vary based on your location and order total.</li>
    </ul>
    <p>For more details, contact our support team.</p>
  `;

  return <PolicyPage title="Shipping Policy" content={content} />;
};
