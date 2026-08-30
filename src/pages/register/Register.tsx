import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES } from "../../constants/countries";
import { register } from "../../services/authService";

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validateForm() {
    const newErrors: RegisterErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
    }

    if (!country) {
      newErrors.country = "Seleccioná un país";
    }

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingresá un email válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmá tu contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setServerError("");

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setLoading(true);

      await register({
        firstName,
        lastName,
        country,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error(
        "Error al registrar usuario:",
        error
      );

      setServerError(
        "No pudimos crear la cuenta. Revisá los datos e intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Registrate para comenzar a usar NomaPay
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Nombre
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(event.target.value)
              }
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Apellido
            </label>

            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(event.target.value)
              }
              placeholder="Apellido"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              País
            </label>

            <select
              id="country"
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">
                Seleccioná tu país
              </option>

              {COUNTRIES.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                >
                  {item.name}
                </option>
              ))}
            </select>

            {errors.country && (
              <p className="mt-1 text-sm text-red-400">
                {errors.country}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="nombre@email.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tenés una cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}