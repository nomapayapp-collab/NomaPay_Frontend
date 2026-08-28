import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "../components/ui/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/"); // al Home, una vez que exista
    } catch (err) {
      // Manejo de errores real (mensajes específicos) queda para el próximo
      // ítem del checklist ("Manejo de errores: credenciales inválidas, email ya usado")
      setError("No pudimos iniciar sesión. Revisá tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          
        <Logo variant="lockup-oscuro" className="w-44 h-auto mb-2" />
          <span className="text-[11px] tracking-[0.22em] uppercase text-text-dark-tertiary">
           Cobrá global. Viví local.  
          </span>
        </div>

        <h1 className="title mb-1 text-center">Bienvenido</h1>
        <p className="subtitle mb-7 text-center"> Entrá para  seguir moviendo tu plata sin fronteras.</p>

        {error && (
          <div className="alert-note alert-note--error mb-4">
            <p className="alert-note__description">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="vos@nomapay.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="input__label mb-0">Contraseña</span>
              <Link to="/recuperar-contrasena" className="text-[12px] text-violet-500 hover:text-violet-700">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
            Continuar
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border-dark" />
          <span className="text-[11px] text-text-dark-tertiary">O</span>
          <div className="flex-1 h-px bg-border-dark" />
        </div>

        <Button variant="outline" fullWidth>
          Continuar con Google
        </Button>

        <p className="text-center text-[13px] text-text-dark-tertiary mt-8">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-violet-500 hover:text-violet-700 font-medium">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
