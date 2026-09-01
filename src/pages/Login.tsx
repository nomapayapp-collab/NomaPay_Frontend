import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Logo } from "../components/ui/Logo";
import { AuthBrandPanel } from "../components/auth/AuthBrandPanel";

import { useAuth } from "../hooks/useAuth";

type LoginErrors = {
  email?: string;
  password?: string;
};

function validateEmail(value: string) {
  if (!value.trim()) return "El email es obligatorio";
  if (!/\S+@\S+\.\S+/.test(value)) return "Ingresá un email válido";
  return undefined;
}

function validatePassword(value: string) {
  return value ? undefined : "La contraseña es obligatoria";
}

const LIGHT_INPUT =
  "lg:bg-surface-light-input lg:border-border-light lg:text-text-light-primary lg:placeholder:text-text-light-tertiary";
const LIGHT_LINK = "lg:text-violet-500 lg:hover:text-violet-700";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  }

  function validateForm() {
    const newErrors: LoginErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Error login:", error);
      setError("No pudimos iniciar sesión. Revisá tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      setError("No pudimos iniciar sesión con Google.");
      return;
    }

    try {
      setError(null);
      setGoogleLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error("Error Google login:", error);
      setError("No pudimos iniciar sesión con Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:flex bg-surface-dark lg:bg-surface-light">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <Logo variant="lockup-oscuro" className="w-44 h-auto mb-2" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-text-dark-tertiary">
              Cobrá global. Viví local.
            </span>
          </div>

          <h1 className="title mb-1 text-center lg:text-left lg:text-3xl lg:text-text-light-primary">
            Bienvenido
          </h1>
          <p className="subtitle mb-7 text-center lg:text-left lg:text-text-light-secondary">
            Entrá para seguir moviendo tu plata sin fronteras.
          </p>

          {error && (
            <div className="alert-note alert-note--error mb-4">
              <p className="alert-note__description lg:text-text-light-secondary">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="vos@nomapay.app"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              className={LIGHT_INPUT}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="input__label mb-0 lg:text-text-light-secondary">Contraseña</span>
                <Link to="/recuperar-contrasena" className={`text-[12px] text-violet-300 hover:text-violet-500 ${LIGHT_LINK}`}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                className={LIGHT_INPUT}
              />
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
              Continuar
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-dark lg:bg-border-light" />
            <span className="text-[11px] text-text-dark-tertiary lg:text-text-light-tertiary">O</span>
            <div className="flex-1 h-px bg-border-dark lg:bg-border-light" />
          </div>

          {/* Dos instancias del botón de Google: el theme lo fija Google al renderizar
              y no se puede cambiar con CSS (es un iframe), así que mostramos/ocultamos
              cada una según el breakpoint en vez de restylear una sola. */}
          <div className="flex justify-center lg:hidden">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => setError("No pudimos iniciar sesión con Google.")}
              theme="filled_black"
              shape="pill"
              size="large"
              width="320"
              text="continue_with"
            />
          </div>
          <div className="hidden lg:flex lg:justify-start">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => setError("No pudimos iniciar sesión con Google.")}
              theme="outline"
              shape="pill"
              size="large"
              width="320"
              text="continue_with"
            />
          </div>

          {googleLoading && (
            <p className="text-center lg:text-left text-[12px] text-text-dark-tertiary lg:text-text-light-tertiary mt-2">
              Verificando con Google…
            </p>
          )}

          <p className="text-center lg:text-left text-[13px] text-text-dark-tertiary lg:text-text-light-tertiary mt-8">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className={`text-violet-300 hover:text-violet-500 font-medium ${LIGHT_LINK}`}>
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}