import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Logo } from "../components/ui/Logo";
import { AuthBrandPanel } from "../components/auth/AuthBrandPanel";
import {
  PasswordRequirements,
  getPasswordChecks,
} from "../components/auth/PasswordRequirements";
import {
  IconUser,
  IconMail,
  IconLock,
  IconBack,
} from "../assets/icons/Icons";

import { COUNTRIES } from "../constants/countries";
import { register } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

type RegisterErrors = {
  name?: string;
  surname?: string;
  country?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function extractErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.error === "string"
  ) {
    return error.response.data.error;
  }

  return fallback;
}

function validateName(value: string) {
  return value.trim()
    ? undefined
    : "El nombre es obligatorio";
}

function validateSurname(value: string) {
  return value.trim()
    ? undefined
    : "El apellido es obligatorio";
}

function validateCountry(value: string) {
  return value
    ? undefined
    : "Seleccioná un país";
}

function validateEmail(value: string) {
  if (!value.trim()) {
    return "El email es obligatorio";
  }

  if (!/\S+@\S+\.\S+/.test(value)) {
    return "Ingresá un email válido";
  }

  return undefined;
}

function validatePasswordValue(value: string) {
  if (!value) {
    return "La contraseña es obligatoria";
  }

  const checks = getPasswordChecks(value, "");

  if (!checks.length) {
    return "Debe tener al menos 8 caracteres";
  }

  if (!checks.uppercase) {
    return "Debe incluir al menos una mayúscula";
  }

  if (!checks.lowercase) {
    return "Debe incluir al menos una minúscula";
  }

  if (!checks.number) {
    return "Debe incluir al menos un número";
  }

  if (!checks.specialCharacter) {
    return "Debe incluir al menos un símbolo";
  }

  return undefined;
}

function validateConfirm(
  value: string,
  password: string,
) {
  if (!value) {
    return "Confirmá tu contraseña";
  }

  if (value !== password) {
    return "Las contraseñas no coinciden";
  }

  return undefined;
}

const LIGHT_INPUT =
  "lg:bg-surface-light-input lg:border-border-light lg:text-text-light-primary lg:placeholder:text-text-light-tertiary";

const LIGHT_LINK =
  "lg:text-violet-500 lg:hover:text-violet-700";

export default function Register() {
  const navigate = useNavigate();
  const { registerWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] =
    useState<RegisterErrors>({});

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] =
    useState(false);

  async function handleGoogleCredential(
    credentialResponse: CredentialResponse,
  ) {
    if (!credentialResponse.credential) {
      setServerError(
        "No pudimos registrarte con Google.",
      );
      return;
    }

    try {
      setServerError("");
      setGoogleLoading(true);

      await registerWithGoogle(
        credentialResponse.credential,
      );

      navigate("/");
    } catch (error) {
      console.error("Error Google register:", error);

      setServerError(
        extractErrorMessage(
          error,
          "No pudimos registrarte con Google.",
        ),
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleNameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setName(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      name: validateName(value),
    }));
  }

  function handleSurnameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setSurname(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      surname: validateSurname(value),
    }));
  }

  function handleCountryChange(value: string) {
    setCountry(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      country: validateCountry(value),
    }));
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setEmail(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      email: validateEmail(value),
    }));
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setPassword(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      password: validatePasswordValue(value),
      confirmPassword: confirmPassword
        ? validateConfirm(confirmPassword, value)
        : previousErrors.confirmPassword,
    }));
  }

  function handleConfirmChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setConfirmPassword(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      confirmPassword: validateConfirm(
        value,
        password,
      ),
    }));
  }

  function validateForm() {
    const newErrors: RegisterErrors = {
      name: validateName(name),
      surname: validateSurname(surname),
      country: validateCountry(country),
      email: validateEmail(email),
      password: validatePasswordValue(password),
      confirmPassword: validateConfirm(
        confirmPassword,
        password,
      ),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(
      (formError) => !formError,
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await register({
        name,
        surname,
        country,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error(
        "Error al registrar usuario:",
        error,
      );

      setServerError(
        extractErrorMessage(
          error,
          "No pudimos crear la cuenta. Revisá los datos e intentá nuevamente.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-dark lg:flex lg:bg-surface-light">
      <AuthBrandPanel />

      <div className="flex-1 px-6 py-8 lg:flex lg:items-center lg:justify-center lg:px-16 lg:py-10">
        <div className="mx-auto max-w-sm lg:mx-0 lg:w-full">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="icon-btn"
              aria-label="Volver"
            >
              <IconBack className="h-5 w-5" />
            </button>

            <Logo
              variant="icono"
              className="h-7 w-7"
            />
          </div>

          <h1 className="title mb-1 lg:text-3xl lg:text-text-light-primary">
            Creá tu cuenta
          </h1>

          <p className="subtitle mb-7 lg:text-text-light-secondary">
            Dos minutos y ya podés recibir cobros del
            exterior.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <span className="input__label lg:text-text-light-secondary">
                Nombre y apellido
              </span>

              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <Input
                  icon={
                    <IconUser className="h-4.5 w-4.5" />
                  }
                  placeholder="Nombre"
                  autoComplete="given-name"
                  value={name}
                  onChange={handleNameChange}
                  error={errors.name}
                  className={LIGHT_INPUT}
                />

                <Input
                  icon={
                    <IconUser className="h-4.5 w-4.5" />
                  }
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
              icon={
                <IconMail className="h-4.5 w-4.5" />
              }
              placeholder="vos@nomapay.app"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              valid={
                !errors.email &&
                email.trim().length > 0
              }
              className={LIGHT_INPUT}
            />

            <Input
              label="Contraseña"
              type="password"
              icon={
                <IconLock className="h-4.5 w-4.5" />
              }
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
                icon={
                  <IconLock className="h-4.5 w-4.5" />
                }
                placeholder="••••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmChange}
                error={errors.confirmPassword}
                className={LIGHT_INPUT}
              />

              <div className="mt-3">
                <PasswordRequirements
                  password={password}
                  confirmPassword={confirmPassword}
                  appearance="auth"
                />
              </div>
            </div>

            <div>
              <Select
                label="País de residencia"
                value={country}
                onChange={handleCountryChange}
                options={COUNTRIES.map(
                  (countryOption) => ({
                    value: countryOption.code,
                    label: countryOption.name,
                  }),
                )}
                placeholder="Seleccioná tu país"
                className={LIGHT_INPUT}
              />

              {errors.country && (
                <p className="mt-1.5 text-[12px] text-magenta-500">
                  {errors.country}
                </p>
              )}
            </div>

            {serverError && (
              <div className="alert-note alert-note--error">
                <p className="alert-note__description lg:text-text-light-secondary">
                  {serverError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Continuar
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-dark lg:bg-border-light" />

            <span className="text-[11px] text-text-dark-tertiary lg:text-text-light-tertiary">
              O
            </span>

            <div className="h-px flex-1 bg-border-dark lg:bg-border-light" />
          </div>

          <div className="flex justify-center lg:hidden">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() =>
                setServerError(
                  "No pudimos registrarte con Google.",
                )
              }
              theme="filled_black"
              shape="pill"
              size="large"
              width="320"
              text="signup_with"
            />
          </div>

          <div className="hidden lg:flex lg:justify-center">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() =>
                setServerError(
                  "No pudimos registrarte con Google.",
                )
              }
              theme="outline"
              shape="pill"
              size="large"
              width="400"
              text="signup_with"
            />
          </div>

          {googleLoading && (
            <p className="mt-2 text-center text-[12px] text-text-dark-tertiary lg:text-left lg:text-text-light-tertiary">
              Verificando con Google…
            </p>
          )}

          <p className="mt-6 text-center text-[13px] text-text-dark-tertiary lg:text-left lg:text-text-light-tertiary">
            ¿Ya tenés cuenta?{" "}

            <Link
              to="/login"
              className={`font-medium text-violet-300 hover:text-violet-500 ${LIGHT_LINK}`}
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
