import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";
import type { CurrencyCode } from "../../types/wallet";

const CURRENCIES: CurrencyCode[] = ["ARS", "USD", "BRL"];

export default function Config() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [alias, setAlias] = useState(
    user?.alias || `${user?.name ?? ""}.${user?.surname ?? ""}`.toLowerCase()
  );
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(
    user?.preferredCurrency ?? "ARS"
  );
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updatedUser = await authService.completeProfile({
        name,
        surname,
        alias,
        preferredCurrency,
        ...(password ? { password } : {}),
      });

      updateUser(updatedUser);
      navigate("/");
    } catch (err) {
      console.error("Error al completar perfil:", err);
      setError("No pudimos guardar tus datos. Probá de nuevo en un momento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-surface-dark">
      <div className="w-full max-w-sm">
        <h1 className="title mb-1 text-center">Completá tu perfil</h1>
        <p className="subtitle mb-7 text-center">
          Antes de entrar, confirmá estos datos. Podés volver a editarlos
          después desde Configuración.
        </p>

        {error && (
          <div className="alert-note alert-note--error mb-4">
            <p className="alert-note__description">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Apellido" value={surname} onChange={(e) => setSurname(e.target.value)} required />
          </div>

          <Input
            label="Email"
            value={user?.email ?? ""}
            disabled
            className="opacity-50 cursor-not-allowed"
            hint="No se puede modificar"
          />

          <Input
            label="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            hint="Así te va a encontrar la gente para pagarte."
            required
          />

          <Input
            label="CBU"
            value={user?.cbu ?? ""}
            disabled
            className="opacity-50 cursor-not-allowed"
            hint="Asignado automáticamente, no se puede modificar"
          />

          <div>
            <label className="input__label" htmlFor="preferredCurrency">Moneda preferida</label>
            <select
              id="preferredCurrency"
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
              className="input"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="Dejalo vacío si no la querés cambiar"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Opcional"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
            Guardar y continuar
          </Button>
        </form>
      </div>
    </div>
  );
}