import { DIFF_STYLE } from "../utils/difficulty-styles";

export const LCChip = ({ p }) => {
  const d = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer"
      className="chip-hover inline-flex items-center gap-[5px] px-[9px] py-1 rounded-md no-underline cursor-pointer"
      style={{ background: d.bg, border: `1px solid ${d.border}` }}
    >
      <span className="text-[10px] sm:text-xs font-mono" style={{ color: "#6a7888" }}>#{p.num}</span>
      <span className="text-[11.5px] sm:text-[13px] font-medium" style={{ color: "#dde6f0" }}>{p.name}</span>
      <span className="text-[9px] sm:text-[10px] font-bold tracking-wide" style={{ color: d.color }}>{p.difficulty}</span>
    </a>
  );
};
