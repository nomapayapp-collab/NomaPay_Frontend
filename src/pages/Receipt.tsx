import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IconBack, IconCheck, IconX, IconClock, IconMail } from "../assets/icons/Icons";
import { useWallet } from "../hooks/useWallet";
import { formatCurrency } from "../utils/formatCurrency";
import { ReceiptPanel } from "../components/ReceiptPanel";
import { transferFunds, type TransferTransaction } from "../services/transferService";
import type { CurrencyCode } from "../types/wallet";

type ReceiptState = {
  amount: number;
  currency: CurrencyCode;
  aliasOrCbu: string;
};

type Phase = "en_proceso" | "aprobada" | "rechazada" | "cancelada";

/** tiempo mínimo que se muestra "en proceso", aunque el backend conteste antes */
const MIN_PROCESSING_MS = 1400;

const PHASE_META: Record<
  Phase,
  {
    badgeLabel: string;
    badgeClassName: string;
    iconClassName: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    message: string;
  }
> = {
  en_proceso: {
    badgeLabel: "En proceso",
    badgeClassName: "badge--warning",
    iconClassName: "bg-amber-500/15 text-amber-500",
    icon: IconClock,
    message: "Estamos procesando tu envío",
  },
  aprobada: {
    badgeLabel: "Aprobada",
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDateTime(date: Date) {
  return date
    .toLocaleString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    .replace(".", "");
}

/**
 * Comprobante — pantalla de resultado de una transferencia. Arranca en
 * "en_proceso" y ahí mismo dispara el POST /transfers real; como el
 * backend responde todo junto (no hay un estado intermedio del lado del
 * server), sostenemos el "en proceso" un mínimo de tiempo aunque la
 * respuesta llegue antes, y recién ahí resolvemos a aprobada/rechazada
 * con los datos/errores reales — o a cancelada si el usuario corta antes
 * (la request sigue en curso, pero su resultado se ignora).
 */
export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refetch } = useWallet();
  const state = location.state as ReceiptState | null;

  const [phase, setPhase] = useState<Phase>("en_proceso");
  const [transaction, setTransaction] = useState<TransferTransaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [date] = useState(() => new Date());
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
      return;
    }

    const startedAt = Date.now();

    async function waitMinimum() {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_PROCESSING_MS) await sleep(MIN_PROCESSING_MS - elapsed);
    }

    transferFunds({ aliasOrCbu: state.aliasOrCbu, currencyCode: state.currency, amount: state.amount })
      .then(async (result) => {
        await waitMinimum();
        if (settledRef.current) return;
        settledRef.current = true;
        setTransaction(result.transaction);
        setPhase("aprobada");
        refetch(); // el saldo cambió del lado del server, traemos el wallet actualizado
      })
      .catch(async (err) => {
        await waitMinimum();
        if (settledRef.current) return;
        settledRef.current = true;
        const message =
          axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
            ? err.response.data.error
            : "No pudimos procesar la transferencia. Probá de nuevo en un rato.";
        setErrorMessage(message);
        setPhase("rechazada");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) return null;

  function handleCancel() {
    if (settledRef.current) return;
    settledRef.current = true;
    setPhase("cancelada");
  }

  function handleSendEmail() {
    if (sendingEmail || emailSent) return;
    // no hay backend de envío de comprobantes por mail — es una
    // simulación, mismo criterio que antes.
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
      case "en_proceso":
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

      case "aprobada":
        if (!transaction) return null;
        return (
          <ReceiptPanel
            rows={[
              { label: "Para", value: transaction.receiverName },
              { label: "Alias", value: transaction.receiverAlias },
              { label: "Comisión", value: "Sin cargo", accent: true },
              { label: "Desde", value: `Saldo en ${transaction.currencyCode}` },
              { label: "Fecha", value: formatDateTime(new Date(transaction.transactionDate)) },
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
              description: errorMessage ?? "No pudimos procesar la transferencia.",
            }}
            rows={[
              { label: "Alias o CBU ingresado", value: state.aliasOrCbu },
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
              { label: "Alias o CBU", value: state.aliasOrCbu },
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
        {transaction && (
          <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary mt-1">
            N° de operación NP-{transaction.id}
          </p>
        )}
      </div>

      {renderPanel(state)}
    </div>
  );
}