import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import * as authService from "../../services/authService";

function validateEmail(value: string) {
  if (!value.trim()) return "El email es obligatorio";
  if (!/\S+@\S+\.\S+/.test(value)) return "Ingresá un email válido";
  return undefined;
}

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      // Mismo mensaje exista o no el email en el sistema, para no revelar
      // qué emails están registrados.
      setSent(true);
    } catch {
      setError("No pudimos procesar la solicitud. Probá de nuevo en un rato.");
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

        <h1 className="title mb-1 text-center">Recuperar contraseña</h1>
        <p className="subtitle mb-7 text-center">
          Ingresá tu email y te mandamos un link para restablecerla.
        </p>

        {sent ? (
          <div className="alert-note alert-note--success">
            <p className="alert-note__description">
              Si el email <strong>{email}</strong> está registrado, te va a llegar un
              link para restablecer tu contraseña en los próximos minutos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && (
              <div className="alert-note alert-note--error">
                <p className="alert-note__description">{error}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="vos@nomapay.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
              Enviar instrucciones
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