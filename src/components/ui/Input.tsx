import { useState, forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { IconEye, IconEyeOff, IconCheck } from "../../assets/icons/Icons";

/**
 * Input — el único campo de texto que debería existir en toda la app.
 *
 * Se usa en Login, Registro, Transferencias, Perfil, modales... siempre el mismo.
 *
 * - label: texto arriba del campo (opcional, pero recomendado siempre)
 * - error: si viene, pinta el borde en magenta y muestra el mensaje abajo
 * - icon: ícono a la izquierda del campo (ej. IconUser, IconMail)
 * - valid: muestra un check verde a la derecha (campos con validación en vivo, ej. email)
 * - type="password": agrega automáticamente el botón de mostrar/ocultar,
 *   no hace falta armar ese toggle de nuevo en cada pantalla
 *
 * Ejemplos:
 *   <Input label="Email" type="email" icon={<IconMail />} valid={emailIsValid} />
 *   <Input label="Contraseña" type="password" icon={<IconLock />} />
 *   <Input label="Alias" error="Ese alias ya está en uso" />
 */

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string; // texto de ayuda gris, cuando no hay error (ej. "Mínimo 8 caracteres")
  icon?: ReactNode;
  valid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, valid, type = "text", id, className, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;
  const showValidCheck = valid && !isPassword;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light-tertiary dark:text-text-dark-tertiary pointer-events-none">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={[
            "input",
            icon && "pl-11",
            (isPassword || showValidCheck) && "pr-11",
            error && "input--error",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
          </button>
        )}

        {showValidCheck && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-turquoise-500">
            <IconCheck className="w-4 h-4" />
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-[12px] text-magenta-500 mt-1.5">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
});