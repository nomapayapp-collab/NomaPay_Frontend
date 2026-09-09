import { IconCheck } from "../../assets/icons/Icons";

export type PasswordChecks = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialCharacter: boolean;
  matches: boolean;
  passwordIsComplete: boolean;
  allValid: boolean;
};

type PasswordRequirementsProps = {
  password: string;
  confirmPassword: string;
  appearance?: "default" | "auth";
};

export function getPasswordChecks(
  password: string,
  confirmPassword: string,
): PasswordChecks {
  const length = password.length >= 8;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);

  const specialCharacter =
    /[^A-Za-z0-9\s]/.test(password);

  const matches =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordIsComplete =
    length &&
    uppercase &&
    lowercase &&
    number &&
    specialCharacter;

  return {
    length,
    uppercase,
    lowercase,
    number,
    specialCharacter,
    matches,
    passwordIsComplete,
    allValid: passwordIsComplete && matches,
  };
}

export function PasswordRequirements({
  password,
  confirmPassword,
  appearance = "default",
}: PasswordRequirementsProps) {
  if (password.length === 0) {
    return null;
  }

  const checks = getPasswordChecks(
    password,
    confirmPassword,
  );

  const requirements = [
    {
      key: "length",
      label: "8 caracteres o más",
      met: checks.length,
    },
    {
      key: "uppercase",
      label: "Mayúsculas (A-Z)",
      met: checks.uppercase,
    },
    {
      key: "lowercase",
      label: "Minúsculas (a-z)",
      met: checks.lowercase,
    },
    {
      key: "number",
      label: "Números (0-9)",
      met: checks.number,
    },
    {
      key: "specialCharacter",
      label: "Caracteres especiales (@, #, $, !)",
      met: checks.specialCharacter,
    },
    {
      key: "matches",
      label: checks.matches
        ? "Las contraseñas coinciden"
        : "Las contraseñas no coinciden",
      met: checks.matches,
    },
  ];

  let strengthScore = 0;

  if (checks.length) {
    strengthScore++;
  }

  if (
    checks.uppercase &&
    checks.lowercase &&
    checks.number
  ) {
    strengthScore++;
  }

  if (checks.specialCharacter) {
    strengthScore++;
  }

  const strengthLabel = checks.passwordIsComplete
    ? "Fuerte"
    : strengthScore <= 1
      ? "Débil"
      : "Media";

  const strengthColor = checks.passwordIsComplete
    ? "bg-turquoise-500"
    : strengthScore <= 1
      ? "bg-magenta-500"
      : "bg-amber-500";

  const strengthTextColor =
    checks.passwordIsComplete
      ? "text-turquoise-500"
      : strengthScore <= 1
        ? "text-magenta-500"
        : "text-amber-500";

  const secondaryTextClass =
    appearance === "auth"
      ? "text-text-dark-secondary lg:text-text-light-secondary"
      : "text-text-light-secondary dark:text-text-dark-secondary";

  const tertiaryTextClass =
    appearance === "auth"
      ? "text-text-dark-tertiary lg:text-text-light-tertiary"
      : "text-text-light-tertiary dark:text-text-dark-tertiary";

  const emptyBarClass =
    appearance === "auth"
      ? "bg-white/10 lg:bg-black/10"
      : "bg-black/10 dark:bg-white/10";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex flex-1 gap-1.5">
            {[0, 1, 2].map((position) => (
              <div
                key={position}
                className={`h-1.5 flex-1 rounded-full ${
                  position < strengthScore
                    ? strengthColor
                    : emptyBarClass
                }`}
              />
            ))}
          </div>

          <span
            className={`text-[12px] font-semibold ${strengthTextColor}`}
          >
            {strengthLabel}
          </span>
        </div>
      </div>

      <p
        className={`text-[12.5px] font-semibold ${secondaryTextClass}`}
      >
        La contraseña debe contener:
      </p>

      <ul className="flex flex-col gap-1.5">
        {requirements.map((requirement) => (
          <li
            key={requirement.key}
            className={`flex items-center gap-1.5 text-[12.5px] ${
              requirement.met
                ? "font-medium text-turquoise-500"
                : tertiaryTextClass
            }`}
          >
            {requirement.met ? (
              <IconCheck className="h-4 w-4 shrink-0" />
            ) : (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            )}

            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}