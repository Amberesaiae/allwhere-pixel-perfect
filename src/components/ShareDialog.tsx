import { useState } from "react";
import { X, Copy, Check, MessageCircle, Facebook, Twitter } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ShareDialog({ open, onClose, url, title }: Props) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const text = encodeURIComponent(`${title} — `);
  const enc = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-bk-dark/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-bk-dark">Share</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-bk-page flex items-center justify-center">
            <X className="w-4 h-4 text-bk-dark" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <a
            href={`https://wa.me/?text=${text}${enc}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-bk-beige hover:border-bk-dark transition"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-[12px] font-semibold text-bk-dark">WhatsApp</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${text}&url=${enc}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-bk-beige hover:border-bk-dark transition"
          >
            <Twitter className="w-5 h-5 text-bk-dark" />
            <span className="text-[12px] font-semibold text-bk-dark">Twitter</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-bk-beige hover:border-bk-dark transition"
          >
            <Facebook className="w-5 h-5 text-bk-dark" />
            <span className="text-[12px] font-semibold text-bk-dark">Facebook</span>
          </a>
        </div>

        <div className="flex items-center gap-2 bg-bk-page border border-bk-beige rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-[13px] text-bk-dark px-2 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[12px] font-semibold bg-bk-dark text-white px-3 py-1.5 rounded-full"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
