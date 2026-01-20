import { createContext } from "react";
import type { HistoryExchange } from "../types/session";

export interface SessionContextValue {
  exchanges: HistoryExchange[];
  selectedExchangeId: string | null;
  addExchange: (exchange: Omit<HistoryExchange, "id" | "timestamp">) => void;
  selectExchange: (id: string | null) => void;
  getExchangeById: (id: string) => HistoryExchange | undefined;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
