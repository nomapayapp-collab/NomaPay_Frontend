import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import {
  PasswordRequirements,
  getPasswordChecks,
} from "../../components/auth/PasswordRequirements";
import { IconLock } from "../../assets/icons/Icons";
import * as authService from "../../services/authService";

type ResetPasswordErrors = {
  password?: string;
  confirmPassword?: string;
};

function validatePassword(value: string) {
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

function validateConfirmPassword(
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] =
    useState<ResetPasswordErrors>({});

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setPassword(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      password: validatePassword(value),
      confirmPassword: confirmPassword
        ? validateConfirmPassword(confirmPassword, value)
        : previousErrors.confirmPassword,
    }));
  }

  function handleConfirmPasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = event.target.value;

    setConfirmPassword(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      confirmPassword: validateConfirmPassword(
        value,
        password,
      ),
    }));
  }

  function validateForm() {
    const newErrors: ResetPasswordErrors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(
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

    if (!token) {
      setServerError(
        "El link no es válido. Pedí uno nuevo desde 'Olvidé mi contraseña'.",
      );
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword(token, password);

      setDone(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch {
      setServerError(
        "El link venció o ya se usó. Pedí uno nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dark px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Logo
            variant="lockup-oscuro"
            className="mb-2 h-auto w-44"
          />
        </div>

        <h1 className="title mb-1 text-center">
          Elegí tu nueva contraseña
        </h1>

        <p className="subtitle mt-2 text-center">
          Creá una contraseña segura para proteger tu cuenta.
        </p>

        {done ? (
          <div className="alert-note alert-note--success mt-6">
            <p className="alert-note__description">
              Listo, tu contraseña se actualizó. Te llevamos
              al inicio de sesión...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Nueva contraseña"
              type="password"
              icon={
                <IconLock className="h-4.5 w-4.5" />
              }
              autoComplete="new-password"
              placeholder="••••••••••"
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
            />

            <div>
              <Input
                label="Confirmar contraseña"
                type="password"
                icon={
                  <IconLock className="h-4.5 w-4.5" />
                }
                autoComplete="new-password"
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
              />

              <div className="mt-3">
                <PasswordRequirements
                  password={password}
                  confirmPassword={confirmPassword}
                  appearance="auth"
                />
              </div>
            </div>

            {serverError && (
              <div className="alert-note alert-note--error">
                <p className="alert-note__description">
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
              Guardar nueva contraseña
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-[13px] text-text-dark-tertiary">
          <Link
            to="/login"
            className="font-medium text-violet-300 hover:text-violet-500"
          >
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}