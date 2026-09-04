/**
 * Contactos frecuentes — mockeados. No hay endpoint de búsqueda de
 * usuarios ni de contactos favoritos en el back todavía, así que
 * Transferir arma la lista de "Frecuentes" con esto.
 */
export type MockContact = {
  id: string;
  name: string;
  alias: string;
};

export const MOCK_CONTACTS: MockContact[] = [
  { id: "1", name: "Julián Torres", alias: "julian.torres.nomapay" },
  { id: "2", name: "Martina Gómez", alias: "martina.gomez" },
  { id: "3", name: "Bruno Ibáñez", alias: "bruno.ibanez" },
];