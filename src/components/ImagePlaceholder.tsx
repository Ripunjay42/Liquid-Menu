import React, { useState } from "react";
import { Sparkles, Wine, GlassWater, Droplet, Eye } from "lucide-react";

interface ImagePlaceholderProps {
  filename: string;
  className?: string;
  themeGradient?: string;
  overlayText?: string;
  imageSrc?: string;
}

export default function ImagePlaceholder({
  filename,
  className = "",
  themeGradient = "linear-gradient(135deg, #2a2520 0%, #111111 100%)",
  overlayText = "",
  imageSrc
}: ImagePlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Select icon based on filename
  const getIcon = () => {
    if (filename.includes("116703") || filename.includes("silence")) {
      return <Droplet className="w-12 h-12 text-[#c9a84c]/40 animate-pulse" />;
    } else if (filename.includes("116699") || filename.includes("state")) {
      return <Wine className="w-12 h-12 text-[#c9a84c]/40 animate-pulse" />;
    } else {
      return <GlassWater className="w-12 h-12 text-[#c9a84c]/40 animate-pulse" />;
    }
  };

  const useImage = imageSrc && !loadError;

  return (
    <div
      id={`placeholder-${filename.replace(".", "-")}`}
      className={`relative overflow-hidden group border border-[#3a342a] rounded-sm transition-all duration-700 select-none ${className}`}
      style={{ background: themeGradient }}
    >
      {/* Real image rendering */}
      {useImage && (
        <img
          src={imageSrc}
          alt={overlayText || "Mixology Composition"}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100 filter brightness-[0.85] contrast-[1.05]" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setLoadError(true)}
        />
      )}

      {/* Grid overlay for texture support */}
      <div className={`absolute inset-0 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none transition-opacity duration-500 ${
        imageLoaded ? "opacity-3 hover:opacity-10" : "opacity-10"
      }`} />

      {/* Glass shine linear shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-out pointer-events-none" />

      {/* Decorative corner crosshairs */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#c9a84c]/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#c9a84c]/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#c9a84c]/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#c9a84c]/40" />

      {/* Overlay controls or fallback UI */}
      {(!useImage || !imageLoaded) && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0a0906]/30 backdrop-blur-[2px]">
          <div className="p-4 bg-[#0a0906]/60 rounded-full border border-[#c9a84c]/20 backdrop-blur-md mb-4 shadow-xl">
            {getIcon()}
          </div>

          <p className="font-serif italic text-lg text-[#e8dfc8] tracking-wide mb-1 px-4">
            {overlayText || "Premium Mixology Composition"}
          </p>
          
          <span className="font-mono text-[10px] text-[#6b5520] tracking-[2px] uppercase bg-[#0a0906]/40 px-2 py-1 border border-[#3a342a] rounded-[2px]">
            {filename}
          </span>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60">
            <Sparkles className="w-3 h-3 text-[#c9a84c]" />
            <span className="font-mono text-[8px] text-[#e8dfc8] tracking-widest uppercase">
              SPEAKEASY ASSET
            </span>
          </div>
        </div>
      )}

      {/* Interactive hover state overlays if image loads */}
      {useImage && imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0906]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
          <div className="relative z-10">
            <span className="font-mono text-[9px] text-[#c9a84c] tracking-widest uppercase mb-1 block">
              Active Selection
            </span>
            <p className="font-serif text-lg text-[#e8dfc8] leading-tight">
              {overlayText}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[#a89575]">
              <Eye className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Scroll of detail card active</span>
            </div>
          </div>
        </div>
      )}

      {/* Soft inner ambient shadow */}
      <div className="absolute inset-0 pointer-events-none shadow-[inner_0px_0px_30px_rgba(10,9,6,0.9)]" />
    </div>
  );
}
