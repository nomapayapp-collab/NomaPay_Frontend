import axios from "axios";
import { useState, type FormEvent } from "react";
import {
  sendChatMessage,
  type ChatHistoryMessage,
} from "../../services/chatService";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type ChatMessage = {
  id: number;
  sender: "user" | "assistant";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "assistant",
    text: "¡Hola! Soy el asistente de NomaPay. ¿En qué puedo ayudarte?",
  },
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    const history: ChatHistoryMessage[] = messages
      .slice(-20)
      .map((chatMessage) => ({
        role:
          chatMessage.sender === "user"
            ? "user"
            : "model",
        text: chatMessage.text,
      }));

    setMessages((currentMessages) =>
      [...currentMessages, userMessage].slice(-20),
    );

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(
        trimmedMessage,
        history,
      );

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text: reply,
      };

      setMessages((currentMessages) =>
        [...currentMessages, assistantMessage].slice(-20),
      );
    } catch (requestError) {
      setError(getChatErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    setMessages(initialMessages);
    setMessage("");
    setError("");
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <Card
          variant="elevated"
          className="mb-4 flex h-120 w-[calc(100vw-2rem)] max-w-92.5 flex-col overflow-hidden p-0 shadow-2xl"
          role="dialog"
          aria-label="Asistente de NomaPay"
        >
          {/* Encabezado */}
          <header className="flex items-center justify-between border-b border-border-light px-4 py-3 dark:border-border-dark">
            <div>
              <h2 className="font-bold text-text-light-primary dark:text-text-dark-primary">
                Asistente NomaPay
              </h2>

              <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                Ayuda sobre el uso de la aplicación
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asistente"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-light-tertiary transition hover:bg-black/5 dark:text-text-dark-tertiary dark:hover:bg-white/10"
            >
              <CloseIcon />
            </button>
          </header>

          {/* Conversación */}
          <div
            className="flex-1 space-y-3 overflow-y-auto scrollbar-app p-4"
            aria-live="polite"
          >
            {messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${
                  chatMessage.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    chatMessage.sender === "user"
                      ? "rounded-br-sm bg-violet-600 text-white"
                      : "rounded-bl-sm bg-black/5 text-text-light-primary dark:bg-white/8 dark:text-text-dark-primary"
                  }`}
                >
                  {chatMessage.text}
                </p>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm bg-black/5 px-4 py-2.5 text-sm text-text-light-tertiary dark:bg-white/8 dark:text-text-dark-tertiary">
                  Escribiendo...
                </p>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-magenta-500/30 bg-magenta-100/10 px-3 py-2 text-sm text-magenta-500"
              >
                {error}
              </p>
            )}
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border-light p-3 dark:border-border-dark"
          >
            <div className="flex gap-2">
              <label
                htmlFor="chat-message"
                className="sr-only"
              >
                Escribí tu consulta
              </label>

              <input
                id="chat-message"
                type="text"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
                placeholder="Escribí tu consulta..."
                autoComplete="off"
                maxLength={1000}
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-border-light bg-surface-light-input px-3 py-2 text-sm text-text-light-primary outline-none focus:border-violet-500 disabled:opacity-60 dark:border-border-dark dark:bg-surface-dark-elevated dark:text-text-dark-primary"
              />

              <Button
                type="submit"
                disabled={!message.trim() || loading}
              >
                {loading ? "..." : "Enviar"}
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={clearConversation}
                className="text-xs font-medium text-text-light-tertiary hover:text-violet-600 dark:text-text-dark-tertiary dark:hover:text-violet-300"
              >
                Limpiar conversación
              </button>

              <span className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                {message.length}/1000
              </span>
            </div>
          </form>
        </Card>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((currentValue) => !currentValue)
        }
        aria-label={
          isOpen
            ? "Cerrar asistente de NomaPay"
            : "Abrir asistente de NomaPay"
        }
        aria-expanded={isOpen}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-cyan-500 text-white shadow-xl transition hover:scale-105"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

function getChatErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Ocurrió un error inesperado. Intentá nuevamente.";
  }

  const backendMessage =
    typeof error.response?.data?.message === "string"
      ? error.response.data.message
      : null;

  if (backendMessage) {
    return backendMessage;
  }

  switch (error.response?.status) {
    case 400:
      return "El mensaje no es válido o es demasiado largo.";

    case 401:
      return "Tu sesión venció. Iniciá sesión nuevamente.";

    case 502:
      return "No pudimos comunicarnos con el asistente. Intentá nuevamente.";

    case 503:
      return "El asistente no está disponible temporalmente.";

    default:
      return "No pudimos enviar tu consulta. Revisá tu conexión.";
  }
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.3 9.3 0 0 1-3.8-.8L3 21l1.7-4.6A8.3 8.3 0 0 1 3 11.5a8.5 8.5 0 0 1 9-8.5 8.5 8.5 0 0 1 9 8.5Z" />

      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}