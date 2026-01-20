import { useState, useCallback, type ReactNode } from "react";
import type { HistoryExchange } from "../types/session";
import { SessionContext } from "./sessionContextDef";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [exchanges, setExchanges] = useState<HistoryExchange[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);

  const addExchange = useCallback((exchange: Omit<HistoryExchange, "id" | "timestamp">) => {
    const newExchange: HistoryExchange = {
      ...exchange,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setExchanges((prev) => [newExchange, ...prev]);
    setSelectedExchangeId(newExchange.id);
  }, []);

  const selectExchange = useCallback((id: string | null) => {
    setSelectedExchangeId(id);
  }, []);

  const getExchangeById = useCallback(
    (id: string) => exchanges.find((e) => e.id === id),
    [exchanges]
  );

  return (
    <SessionContext.Provider
      value={{
        exchanges,
        selectedExchangeId,
        addExchange,
        selectExchange,
        getExchangeById,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
