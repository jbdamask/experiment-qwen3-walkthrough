interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
      >
        <div className="p-4">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Session History
          </h2>
          <div className="text-sm text-slate-500 italic">
            No conversations yet. Start by entering a prompt!
          </div>
        </div>
      </aside>
    </>
  );
}
