import { api } from "./api";
import type { FrequentContact } from "../types/contact";

// GET /contacts real: contactos frecuentes calculados por el back a partir
// de las transferencias completadas del usuario (contact.service.ts).
export async function getFrequentContacts(): Promise<FrequentContact[]> {
  const { data } = await api.get<FrequentContact[]>("/contacts");
  return data;
}
