import axios from "axios";
import { api } from "./api";
import type { AliasLookupResult, FrequentContact } from "../types/contact";

// GET /contacts real: contactos frecuentes calculados por el back a partir
// de las transferencias completadas del usuario (contact.service.ts).
export async function getFrequentContacts(): Promise<FrequentContact[]> {
  const { data } = await api.get<FrequentContact[]>("/contacts");
  return data;
}

// GET /contacts/lookup?alias=X — ya armado en el back (contact.service.ts,
// lookupContactByAliasOrCbu). Devuelve 200 con
// { alias, cbu, name, surname, profilePictureUrl, isSelf } si el alias/CBU
// pertenece a un usuario real, o 404 con
// { error: "No se encontró ningún usuario con ese alias o CBU." } si no.
//
// Solo interpretamos como "alias inexistente" un 404 con ESE shape
// puntual (AppError -> { error: string }). Cualquier otro error —
// de red, 500, o un 400 si por algún motivo se manda vacío — se
// propaga: el caller lo trata como "no pudimos verificar" y no bloquea
// al usuario.
export async function lookupAlias(aliasOrCbu: string): Promise<AliasLookupResult> {
  try {
    const { data } = await api.get<{ name: string; surname: string; alias: string }>(
      "/contacts/lookup",
      { params: { alias: aliasOrCbu } },
    );
    return { found: true, name: data.name, surname: data.surname, alias: data.alias };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404 && typeof err.response.data?.error === "string") {
      return { found: false };
    }
    throw err;
  }
}
