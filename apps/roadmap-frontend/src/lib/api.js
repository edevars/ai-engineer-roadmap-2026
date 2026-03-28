const BASE = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("roadmap_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}/api/v1${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),

  // Weekly progress
  getWeekly: (weekKey) => request(`/progress/weekly/${weekKey}`),
  toggleWeeklyCell: (weekKey, cellKey) =>
    request(`/progress/weekly/${weekKey}/${cellKey}`, { method: "PUT" }),

  // Phase progress
  getPhases: (roadmap) => request(`/progress/phases/${roadmap}`),
  togglePhase: (roadmap, phaseKey) =>
    request(`/progress/phases/${roadmap}/${phaseKey}`, { method: "PUT" }),
};
