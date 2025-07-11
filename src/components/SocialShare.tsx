"use client";

import Image from "next/image";

type Props = {
  postUrl: string;
  postTitle: string;
};

export default function SocialShare({ postUrl, postTitle }: Props) {
  return (
    <div className="flex justify-center gap-6 mb-12 text-sm text-base-500">
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:underline"
      >
        <span className="bg-white p-1 rounded">
          <Image
            src="/linkedin.svg"
            alt="LinkedIn"
            className="w-4 h-4"
            width={16}
            height={16}
          />
        </span>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:underline"
      >
        <span className="bg-white p-1 rounded">
          <Image src="/X.svg" alt="X" className="w-4 h-4" width={16} height={16} />
        </span>
      </a>

      <button
        onClick={() => {
          navigator.clipboard.writeText(postUrl);
          alert("Link copied to clipboard!");
        }}
        className="flex items-center gap-2 hover:underline"
      >
        <span className="bg-white p-1 rounded">
          <Image
            src="/create-link.svg"
            alt="Copy link"
            className="w-4 h-4"
            width={16}
            height={16}
          />
        </span>
      </button>
    </div>
  );
}