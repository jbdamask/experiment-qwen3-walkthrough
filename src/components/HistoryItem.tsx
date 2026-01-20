import type { HistoryExchange } from "../types/session";

interface HistoryItemProps {
  exchange: HistoryExchange;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function HistoryItem({ exchange, isSelected, onSelect }: HistoryItemProps) {
  // Truncate prompt for preview (max 50 chars)
  const truncatedPrompt =
    exchange.prompt.length > 50
      ? exchange.prompt.slice(0, 50) + "..."
      : exchange.prompt;

  // Format timestamp
  const formattedTime = new Date(exchange.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = new Date(exchange.timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(exchange.id)}
      className={`
        w-full text-left p-3 rounded-lg transition-colors duration-150
        ${
          isSelected
            ? "bg-indigo-100 border border-indigo-300"
            : "bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
        }
      `}
      aria-pressed={isSelected}
      aria-label={`View exchange: ${truncatedPrompt}`}
    >
      <div className="flex items-start gap-2">
        {/* Image indicator */}
        {exchange.imageUrl && (
          <div className="flex-shrink-0 w-8 h-8 rounded bg-slate-200 overflow-hidden">
            <img
              src={exchange.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Prompt preview */}
          <p
            className={`text-sm font-medium truncate ${
              isSelected ? "text-indigo-900" : "text-slate-800"
            }`}
          >
            {truncatedPrompt}
          </p>

          {/* Timestamp */}
          <p
            className={`text-xs mt-1 ${
              isSelected ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            {formattedDate} at {formattedTime}
          </p>
        </div>
      </div>
    </button>
  );
}
