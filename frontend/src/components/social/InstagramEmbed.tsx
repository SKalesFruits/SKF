import React from "react";

interface InstagramEmbedProps {
  postId: string;
}

export const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ postId }) => {
  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.instagram.com/p/${postId}/embed`}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};
