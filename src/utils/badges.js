export const getBadge = (resource) => {
  if (resource.owned) return { label: "OWNED", bg: "rgba(120,180,255,0.15)", color: "#78b4ff" };
  if (resource.free)  return { label: "FREE",  bg: "rgba(0,200,150,0.15)",  color: "#00c896" };
  return                     { label: "PAID",  bg: "rgba(255,180,0,0.15)",  color: "#ffb800" };
};
