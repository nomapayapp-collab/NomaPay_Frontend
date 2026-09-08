import axios from "axios";
import { api } from "./api";
import type { AliasLookupResult, FrequentContact } from "../types/contact";

// GET /contacts real: contactos frecuentes calculados por el back a partir
// de las transferencias completadas del usuario (contact.service.ts).
export async function getFrequentContacts(): Promise<FrequentContact[]> {
  const { data } = await api.get<FrequentContact[]>("/contacts");
  return data;
}

// GET /contacts/lookup?alias=X — TODAVÍA NO EXISTE en el back (pendiente,
// avisado a Gastón/Gisella). Cuando lo armen tiene que devolver 200 con
// { name, surname, alias } si el alias/CBU pertenece a un usuario real, o
// 404 con { error: "No se encontró ningún usuario con ese alias o CBU." }
// si no — mismo mensaje/shape que ya usa POST /transfers, así este método
// puede reconocerlo con confianza.
//
// Solo interpretamos como "alias inexistente" un 404 con ESE shape
// puntual (AppError -> { error: string }). Cualquier otro error —
// incluido el 404 genérico de Express mientras la ruta no exista
// todavía, o un error de red/500 — se propaga: el caller lo trata como
// "no pudimos verificar" y no bloquea al usuario (se comporta igual que
// antes de este cambio).
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
