import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconBack, IconCheck, IconX, IconClock, IconMail } from "../assets/icons/Icons";
import { useWallet } from "../hooks/useWallet";
import { formatCurrency } from "../utils/formatCurrency";
import { ReceiptPanel } from "../components/ReceiptPanel";
import type { CurrencyCode } from "../types/wallet";

type ReceiptState = {
  amount: number;
  currency: CurrencyCode;
  recipientName: string;
  recipientAlias: string;
  /** viene de Frecuentes (true) o fue un alias/CBU tipeado a mano (false) */
  known: boolean;
};

type Phase = "pendiente" | "completada" | "rechazada" | "cancelada";

const PENDING_MS = 2200;

const PHASE_META: Record <
  Phase,
  {
    badgeLabel: string;
    badgeClassName: string;
    iconClassName: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    message: string;
  }
> = {
  pendiente: {
    badgeLabel: "Pendiente",
    badgeClassName: "badge--warning",
    iconClassName: "bg-amber-500/15 text-amber-500",
    icon: IconClock,
    message: "Estamos procesando tu envío",
  },
  completada: {
    badgeLabel: "Completada",
    badgeClassName: "badge--success",
    iconClassName: "bg-turquoise-500/15 text-turquoise-500",
    icon: IconCheck,
    message: "Transferencia enviada",
  },
  rechazada: {
    badgeLabel: "Rechazada",
    badgeClassName: "badge--error",
    iconClassName: "bg-magenta-500/15 text-magenta-500",
    icon: IconX,
    message: "No pudimos enviar el dinero",
  },
  cancelada: {
    badgeLabel: "Cancelada",
    badgeClassName: "bg-black/8 dark:bg-white/10 text-text-light-secondary dark:text-text-dark-secondary",
    iconClassName: "bg-black/8 dark:bg-white/10 text-text-light-tertiary dark:text-text-dark-tertiary",
    icon: IconX,
    message: "Cancelaste la operación",
  },
};

function randomOpId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `NP-${id}`;
}

function formatDateTime(date: Date) {
  return date
    .toLocaleString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    .replace(".", "");
}

/**
 * Comprobante — pantalla de resultado de una operación (por ahora,
 * transferencias). Arranca en "pendiente", simula el tiempo de validar
 * con el banco y resuelve en "completada"/"rechazada" — o "cancelada" si
 * el usuario corta antes. Todo mockeado: no hay backend de
 * transferencias, la regla de aceptar/rechazar es local (contacto de
 * Frecuentes = se acredita, alias tipeado a mano = se rechaza).
 *
 * El contenido de cada fase se arma acá abajo (renderPanel) y se lo
 * pasamos a ReceiptPanel, que es el único que sabe dibujar esa
 * estructura — evita repetir el mismo markup 4 veces.
 */
export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mockTransfer } = useWallet();
  const state = location.state as ReceiptState | null;

  const [phase, setPhase] = useState<Phase>("pendiente");
  const [operationId] = useState(randomOpId);
  const [date] = useState(() => new Date());
  const [attempt] = useState(() => 1 + Math.floor(Math.random() * 2));
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
      return;
    }

    timerRef.current = setTimeout(() => {
      resolvedRef.current = true;
      if (state.known) {
        mockTransfer({ currencyCode: state.currency, amount: state.amount, recipientLabel: state.recipientName });
        setPhase("completada");
      } else {
        setPhase("rechazada");
      }
    }, PENDING_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) return null;

  function handleCancel() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!resolvedRef.current) {
      resolvedRef.current = true;
      setPhase("cancelada");
    }
  }

  function handleSendEmail() {
    if (sendingEmail || emailSent) return;
    // no hay backend de envío de comprobantes por mail — es una
    // simulación, mismo criterio que mockDeposit/mockTransfer.
    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    }, 600);
  }

  const meta = PHASE_META[phase];
  const amountLabel = formatCurrency(state.amount, state.currency);

  function renderPanel(state: ReceiptState) {
    switch (phase) {
      case "pendiente":
        return (
          <ReceiptPanel
            checklist={[
              {
                label: "Solicitud recibida",
                state: "done",
                meta: date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
              },
              { label: "Validando con el banco", state: "active", meta: "en curso" },
              { label: "Acreditado al destinatario", state: "pending" },
            ]}
            note={{
              variant: "warning",
              description: "Suele demorar hasta 5 minutos. Te avisamos por notificación cuando se acredite.",
            }}
            actions={[{ label: "Cancelar operación", variant: "outline", onClick: handleCancel }]}
          />
        );

      case "completada":
        return (
          <ReceiptPanel
            rows={[
              { label: "Para", value: state.recipientName },
              { label: "Alias", value: state.recipientAlias },
              { label: "Comisión", value: "Sin cargo", accent: true },
              { label: "Desde", value: `Saldo en ${state.currency}` },
              { label: "Fecha", value: formatDateTime(date) },
            ]}
            actions={[
              {
                label: emailSent ? "Enviado" : "Enviar por mail",
                variant: "outline",
                onClick: handleSendEmail,
                loading: sendingEmail,
                icon: emailSent ? IconCheck : IconMail,
              },
              { label: "Volver al inicio", variant: "primary", onClick: () => navigate("/") },
            ]}
          />
        );

      case "rechazada":
        return (
          <ReceiptPanel
            note={{
              variant: "error",
              title: "Motivo",
              description: "La cuenta no es válida o el destinatario no existe. No se descontó nada de tu saldo.",
            }}
            rows={[
              { label: "Alias ingresado", value: state.recipientAlias },
              { label: "N° de intento", value: String(attempt) },
              { label: "Fecha", value: formatDateTime(date) },
            ]}
            actions={[
              { label: "Revisar y reintentar", variant: "primary", onClick: () => navigate("/transfer") },
              { label: "Volver al inicio", variant: "ghost", onClick: () => navigate("/") },
            ]}
          />
        );

      case "cancelada":
        return (
          <ReceiptPanel
            rows={[
              { label: "Para", value: state.recipientName },
              { label: "Alias", value: state.recipientAlias },
              { label: "Fecha", value: formatDateTime(date) },
            ]}
            note={{
              variant: "info",
              description: "No se descontó nada de tu saldo. Podés volver a intentarlo cuando quieras.",
            }}
            actions={[
              { label: "Volver a intentar", variant: "primary", onClick: () => navigate("/transfer") },
              { label: "Volver al inicio", variant: "ghost", onClick: () => navigate("/") },
            ]}
          />
        );
    }
  }

  return (
    <div className="px-5 pt-8 pb-8 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/")} className="icon-btn" aria-label="Volver">
            <IconBack className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">Comprobante</h1>
        </div>
        <span className={`badge ${meta.badgeClassName}`}>{meta.badgeLabel}</span>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${meta.iconClassName}`}>
          <meta.icon className="w-8 h-8" />
        </div>
        <p className="text-[14px] text-text-light-secondary dark:text-text-dark-secondary mb-2">{meta.message}</p>
        <p className="text-[32px] font-bold text-text-light-primary dark:text-text-dark-primary">{amountLabel}</p>
        <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary mt-1">
          N° de operación {operationId}
        </p>
      </div>

      {renderPanel(state)}
    </div>
  );
}