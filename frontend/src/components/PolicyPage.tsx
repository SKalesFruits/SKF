import React from "react";

interface PolicyPageProps {
  title: string;
  content: string;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ title, content }) => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>
        <div className="bg-white p-6 shadow-md rounded-md text-gray-700">
          <p
            className="leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};
