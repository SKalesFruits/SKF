import React from "react";

interface InstagramEmbedProps {
  postId: string;
}

export const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ postId }) => {
  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.instagram.com/reel/${"DJCia5noYAN"}/embed`}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};
