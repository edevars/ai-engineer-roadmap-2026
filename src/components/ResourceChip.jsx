import { BookMarked, ExternalLink } from "lucide-react";
import { getBadge } from "../utils/badges";
import { useIsMobile } from "../hooks/use-is-mobile";

export const ResourceChip = ({ resource, color }) => {
  const isMobile = useIsMobile();
  const badge = getBadge(resource);
  const bg = resource.owned ? "rgba(120,180,255,0.07)" : resource.free ? "rgba(255,255,255,0.05)" : color + "14";
  const border = resource.owned ? "1px solid rgba(120,180,255,0.25)" : resource.free ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${color}33`;
  const textColor = resource.owned ? "#78b4ff" : resource.free ? "#a0b0c0" : color;
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="chip-hover"
      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: bg, border, borderRadius: "6px", fontSize: isMobile ? "11.5px" : "13px", color: textColor, textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap" }}
    >
      {resource.owned
        ? <BookMarked size={10} style={{ opacity: 0.7, flexShrink: 0 }} />
        : <ExternalLink size={10} style={{ opacity: 0.6, flexShrink: 0 }} />
      }
      {resource.name}
      <span style={{ fontSize: isMobile ? "9px" : "10px", padding: "1px 5px", borderRadius: "4px", background: badge.bg, color: badge.color, fontWeight: 700 }}>{badge.label}</span>
    </a>
  );
};
