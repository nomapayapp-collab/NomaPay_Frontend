// Coincide con FrequentContact del back (GET /contacts) — ver
// src/services/contact.service.ts del repo de back. Son los 3 contactos
// con los que más transferencias completadas tuvo el usuario.
export type FrequentContact = {
  id: number;
  alias: string | null;
  cbu: string | null;
  name: string;
  surname: string;
  profilePictureUrl: string | null;
  interactionCount: number;
};
