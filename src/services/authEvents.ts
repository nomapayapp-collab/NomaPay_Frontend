// authEvents.ts — puente mínimo entre api.ts y AuthContext.
//
// api.ts no puede importar AuthContext directamente sin crear un ciclo
// (AuthContext -> authService -> api -> ¿AuthContext?). En vez de eso,
// api.ts emite un evento de DOM cuando confirma que la sesión ya no se
// puede renovar (el refresh token también venció o fue revocado), y
// AuthContext se suscribe a ese evento para limpiar el usuario en memoria.
// Con eso, <ProtectedRoute> hace el resto (redirige a /login solo).

const SESSION_EXPIRED_EVENT = "nomapay:session-expired";

export function emitSessionExpired(): void {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function onSessionExpired(handler: () => void): () => void {
  window.addEventListener(SESSION_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
}
