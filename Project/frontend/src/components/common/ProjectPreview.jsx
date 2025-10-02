import React from "react";

export default function ProjectPreview({
  title,
  description = "Repository description",
  likes,
  showLikes = true,
  icon = null,
  bullet = false,
}) {
  const formatLikes = (n) => (n >= 1000 ? `${Math.floor(n / 1000)}k` : `${n}`);

  return (
    <article className="flex items-start justify-between">
      <div className="flex items-start gap-2.5">
        {bullet && <span className="w-3 h-3 mt-1.5 bg-gray-400 rounded-full shrink-0" />}

        {icon === "folder" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mt-0.5 text-gray-500 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6z" />
            <path d="M2 9h18v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
          </svg>
        )}

        <div>
          <h4 className="text-xs font-semibold text-black leading-tight">{title}</h4>
          <p className="text-[11px] text-gray-600 leading-snug">{description}</p>
        </div>
      </div>

      {showLikes && (
        <div className="flex items-center gap-1.5 text-sm text-gray-700">
          <span className="font-bold text-gray-600 text-base" aria-hidden="true">
            &#9734;
          </span>
          <span className="font-medium">{formatLikes(likes ?? 0)}</span>
        </div>
      )}
    </article>
  );
}
