
export type FrequentContact = {
  id: number;
  alias: string | null;
  cbu: string | null;
  name: string;
  surname: string;
  profilePictureUrl: string | null;
  interactionCount: number;
};

export type AliasLookupResult =
  | { found: true; name: string; surname: string; alias: string }
  | { found: false };
