import { useSession } from "../hooks/useSession";
import { HistoryItem } from "./HistoryItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { exchanges, selectedExchangeId, selectExchange } = useSession();

  const handleSelectExchange = (id: string) => {
    selectExchange(id);
    // Close sidebar on mobile when selecting an item
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 bottom-0 left-0 z-30 w-64 bg-slate-50 border-r border-slate-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Session history"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Session History
            </h2>
            {exchanges.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {exchanges.length} exchange{exchanges.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {exchanges.length === 0 ? (
              <div className="text-sm text-slate-500 italic py-4 text-center">
                No conversations yet. Start by entering a prompt!
              </div>
            ) : (
              <ul className="space-y-2" role="list" aria-label="Conversation history">
                {exchanges.map((exchange) => (
                  <li key={exchange.id}>
                    <HistoryItem
                      exchange={exchange}
                      isSelected={exchange.id === selectedExchangeId}
                      onSelect={handleSelectExchange}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
