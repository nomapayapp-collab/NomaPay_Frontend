import axios from "axios";
import { api } from "./api";
import type { AliasLookupResult, FrequentContact } from "../types/contact";

// GET /contacts real: contactos frecuentes calculados por el back a partir
// de las transferencias completadas del usuario (contact.service.ts).
export async function getFrequentContacts(): Promise<FrequentContact[]> {
  const { data } = await api.get<FrequentContact[]>("/contacts");
  return data;
}

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
