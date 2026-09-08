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

// Resultado de GET /contacts/lookup?alias=X — endpoint todavía no armado
// en el back (pendiente para Gastón/Gisella), pensado para verificar un
// alias/CBU en el momento en que se busca en Transferir, antes de llegar
// a confirmar. found:false = el back respondió 404 con el mismo mensaje
// que ya usa POST /transfers ("No se encontró ningún usuario con ese
// alias o CBU."); found:true trae el nombre real para mostrarlo.
export type AliasLookupResult =
  | { found: true; name: string; surname: string; alias: string }
  | { found: false };
