import { BookMarked, ExternalLink } from "lucide-react";
import { getBadge } from "../utils/badges";

export const ResourceChip = ({ resource, color }) => {
  const badge = getBadge(resource);
  const bg = resource.owned ? "rgba(120,180,255,0.07)" : resource.free ? "rgba(255,255,255,0.05)" : color + "14";
  const border = resource.owned ? "1px solid rgba(120,180,255,0.25)" : resource.free ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${color}33`;
  const textColor = resource.owned ? "#78b4ff" : resource.free ? "#a0b0c0" : color;
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer"
      className="chip-hover inline-flex items-center gap-[5px] px-2.5 py-1 rounded-md no-underline cursor-pointer whitespace-nowrap text-[11.5px] sm:text-[13px]"
      style={{ background: bg, border, color: textColor }}
    >
      {resource.owned
        ? <BookMarked size={10} className="opacity-70 shrink-0" />
        : <ExternalLink size={10} className="opacity-60 shrink-0" />
      }
      {resource.name}
      <span className="text-[9px] sm:text-[10px] py-px px-[5px] rounded font-bold" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
    </a>
  );
};
