import React from "react";

interface VideoEmbedProps {
  videoId: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId }) => {
  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
