import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.error || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e0e6f0",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const loadingText = mode === "login" ? "Entrando..." : "Creando...";

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "#111620",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 380,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: "#5a6880",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={18} />
        </button>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 22,
            fontWeight: 700,
            color: "#e0e6f0",
          }}
        >
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#5a6880" }}>
          {mode === "login"
            ? "Guarda tu progreso entre sesiones"
            : "Registra tu cuenta para persistir tu progreso"}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {mode === "register" && (
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            style={inputStyle}
          />

          {/* Password with toggle */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
              style={{ ...inputStyle, paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#5a6880",
                cursor: "pointer",
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "#ff6b6b", padding: "6px 0" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="auth-submit"
            style={{
              padding: "11px 0",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #7C3AED, #00D4FF)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting
              ? loadingText
              : mode === "login"
                ? "Entrar"
                : "Registrarse"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="auth-toggle"
            style={{
              background: "none",
              border: "none",
              color: "#7C3AED",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
