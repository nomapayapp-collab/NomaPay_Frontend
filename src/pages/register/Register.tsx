import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Logo } from "../../components/ui/Logo";
import { AuthBrandPanel } from "../../components/auth/AuthBrandPanel";
import { IconUser, IconMail, IconLock, IconBack } from "../../assets/icons/Icons";

import { COUNTRIES } from "../../constants/countries";
import { register } from "../../services/authService";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";

type RegisterErrors = {
  name?: string;
  surname?: string;
  country?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

function validateName(value: string) {
  return value.trim() ? undefined : "El nombre es obligatorio";
}
function validateSurname(value: string) {
  return value.trim() ? undefined : "El apellido es obligatorio";
}
function validateCountry(value: string) {
  return value ? undefined : "Seleccioná un país";
}
function validateEmail(value: string) {
  if (!value.trim()) return "El email es obligatorio";
  if (!/\S+@\S+\.\S+/.test(value)) return "Ingresá un email válido";
  return undefined;
}
function validatePasswordValue(value: string) {
  if (!value) {
    return "La contraseña es obligatoria";
  }

  if (value.length < 8) {
    return "Debe tener al menos 8 caracteres";
  }

  if (!/[A-Z]/.test(value)) {
    return "Debe incluir al menos una mayúscula";
  }

  if (!/[a-z]/.test(value)) {
    return "Debe incluir al menos una minúscula";
  }

  if (!/[0-9]/.test(value)) {
    return "Debe incluir al menos un número";
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return "Debe incluir al menos un símbolo";
  }

  return undefined;
}
function validateConfirm(value: string, password: string) {
  if (!value) return "Confirmá tu contraseña";
  if (value !== password) return "Las contraseñas no coinciden";
  return undefined;
}

const LIGHT_INPUT =
  "lg:bg-surface-light-input lg:border-border-light lg:text-text-light-primary lg:placeholder:text-text-light-tertiary";
const LIGHT_LINK = "lg:text-violet-500 lg:hover:text-violet-700";

export default function Register() {
  const navigate = useNavigate();
  const { registerWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
    async function handleGoogleCredential(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      setServerError("No pudimos registrarte con Google.");
      return;
    }

    try {
      setServerError("");
      setGoogleLoading(true);
      await registerWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error("Error Google register:", error);
      setServerError(extractErrorMessage(error, "No pudimos registrarte con Google."));
    } finally {
      setGoogleLoading(false);
    }
  }
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({ ...prev, name: validateName(value) }));
  }

  function handleSurnameChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSurname(value);
    setErrors((prev) => ({ ...prev, surname: validateSurname(value) }));
  }

  function handleCountryChange(value: string) {
    setCountry(value);
    setErrors((prev) => ({ ...prev, country: validateCountry(value) }));
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({
      ...prev,
      password: validatePasswordValue(value),
      confirmPassword: confirmPassword ? validateConfirm(confirmPassword, value) : prev.confirmPassword,
    }));
  }

  function handleConfirmChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, confirmPassword: validateConfirm(value, password) }));
  }

  function validateForm() {
    const newErrors: RegisterErrors = {
      name: validateName(name),
      surname: validateSurname(surname),
      country: validateCountry(country),
      email: validateEmail(email),
      password: validatePasswordValue(password),
      confirmPassword: validateConfirm(confirmPassword, password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      await register({ name, surname, country, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setServerError(extractErrorMessage(error, "No pudimos crear la cuenta. Revisá los datos e intentá nuevamente."));
    } finally {
      setLoading(false);
    }
  }

  const hasLength = password.length >= 8 ;
const hasUppercase = /[A-Z]/.test(password);
const hasLowercase = /[a-z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSymbol = /[^A-Za-z0-9]/.test(password);

const strengthScore = [
  hasLength,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSymbol,
].filter(Boolean).length;

const strengthLabel =
  strengthScore <= 2
    ? "Débil"
    : strengthScore <= 4
      ? "Segura"
      : "Muy segura";

const strengthColor =
  strengthScore <= 2
    ? "bg-magenta-500"
    : "bg-turquoise-500";

const strengthTextColor =
  strengthScore <= 2
    ? "text-magenta-500"
    : "text-turquoise-500";
  return (
    <div className="min-h-screen lg:flex bg-surface-dark lg:bg-surface-light">
      <AuthBrandPanel />

      <div className="flex-1 px-6 py-8 lg:flex lg:items-center lg:justify-center lg:px-16 lg:py-10">
        <div className="max-w-sm mx-auto lg:mx-0 lg:w-full">
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button type="button" onClick={() => navigate(-1)} className="icon-btn" aria-label="Volver">
              <IconBack className="w-5 h-5" />
            </button>
            <Logo variant="icono" className="w-7 h-7" />
          </div>

          <h1 className="title mb-1 lg:text-3xl lg:text-text-light-primary">Creá tu cuenta</h1>
          <p className="subtitle mb-7 lg:text-text-light-secondary">
            Dos minutos y ya podés recibir cobros del exterior.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <span className="input__label lg:text-text-light-secondary">Nombre y apellido</span>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <Input
                  icon={<IconUser className="w-4.5 h-4.5" />}
                  placeholder="Nombre"
                  autoComplete="given-name"
                  value={name}
                  onChange={handleNameChange}
                  error={errors.name}
                  className={LIGHT_INPUT}
                />
                <Input
                  icon={<IconUser className="w-4.5 h-4.5" />}
                  placeholder="Apellido"
                  autoComplete="family-name"
                  value={surname}
                  onChange={handleSurnameChange}
                  error={errors.surname}
                  className={LIGHT_INPUT}
                />
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              icon={<IconMail className="w-4.5 h-4.5" />}
              placeholder="vos@nomapay.app"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              valid={!errors.email && email.trim().length > 0}
              className={LIGHT_INPUT}
            />

            <Input
              label="Contraseña"
              type="password"
              icon={<IconLock className="w-4.5 h-4.5" />}
              placeholder="••••••••••"
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              className={LIGHT_INPUT}
            />

            <div>
              <Input
                label="Confirmar contraseña"
                type="password"
                icon={<IconLock className="w-4.5 h-4.5" />}
                placeholder="••••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmChange}
                error={errors.confirmPassword}
                className={LIGHT_INPUT}
              />

              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex gap-1.5 flex-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${i < strengthScore ? strengthColor : "bg-white/10"} lg:${i < strengthScore ? strengthColor : "bg-black/10"}`}
                        />
                      ))}
                    </div>
                    <span className={`text-[12px] font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
                  </div>
                  <p className="text-[12px] text-text-dark-tertiary lg:text-text-light-tertiary">
                    Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo.
                  </p>
                </div>
              )}
            </div>

            <div>
              <Select
                label="País de residencia"
                value={country}
                onChange={handleCountryChange}
                options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                placeholder="Seleccioná tu país"
                className={LIGHT_INPUT}
              />
              {errors.country && <p className="text-[12px] text-magenta-500 mt-1.5">{errors.country}</p>}
            </div>

            {serverError && (
              <div className="alert-note alert-note--error">
                <p className="alert-note__description lg:text-text-light-secondary">{serverError}</p>
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
              Continuar
            </Button>
          </form>
<div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-dark lg:bg-border-light" />
            <span className="text-[11px] text-text-dark-tertiary lg:text-text-light-tertiary">O</span>
            <div className="flex-1 h-px bg-border-dark lg:bg-border-light" />
          </div>

          <div className="flex justify-center lg:hidden">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => setServerError("No pudimos registrarte con Google.")}
              theme="filled_black"
              shape="pill"
              size="large"
              width="320"
              text="signup_with"
            />
          </div>
          <div className="hidden lg:flex lg:justify-start">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => setServerError("No pudimos registrarte con Google.")}
              theme="outline"
              shape="pill"
              size="large"
              width="320"
              text="signup_with"
            />
          </div>

          {googleLoading && (
            <p className="text-center lg:text-left text-[12px] text-text-dark-tertiary lg:text-text-light-tertiary mt-2">
              Verificando con Google…
            </p>
          )}

          <p className="text-center lg:text-left text-[13px] text-text-dark-tertiary lg:text-text-light-tertiary mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className={`text-violet-300 hover:text-violet-500 font-medium ${LIGHT_LINK}`}>
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}