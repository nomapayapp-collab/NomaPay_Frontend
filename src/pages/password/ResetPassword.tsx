import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import * as authService from "../../services/authService";

function validatePassword(value: string) {
  if (!value) return "La contraseña es obligatoria";
  if (value.length < 8) return "Mínimo 8 caracteres";
  return undefined;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      setError("El link no es válido. Pedí uno nuevo desde 'Olvidé mi contraseña'.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setError("El link venció o ya se usó. Pedí uno nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo variant="lockup-oscuro" className="w-44 h-auto mb-2" />
        </div>

        <h1 className="title mb-1 text-center">Elegí tu nueva contraseña</h1>

        {done ? (
          <div className="alert-note alert-note--success mt-4">
            <p className="alert-note__description">
              Listo, tu contraseña se actualizó. Te llevamos al login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-7" noValidate>
            {error && (
              <div className="alert-note alert-note--error">
                <p className="alert-note__description">{error}</p>
              </div>
            )}

            <Input
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
              Guardar nueva contraseña
            </Button>
          </form>
        )}

        <p className="text-center text-[13px] text-text-dark-tertiary mt-8">
          <Link to="/login" className="text-violet-300 hover:text-violet-500 font-medium">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}