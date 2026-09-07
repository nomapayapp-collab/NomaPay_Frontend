import { api } from "./api";
import type { HistoryItem } from "../types/history";

export async function getHistory(): Promise<HistoryItem[]> {
  const { data } = await api.get<HistoryItem[]>("/history");
  return data;
}
