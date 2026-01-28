import { Menu } from "lucide-react";

interface MobileNavbarProps {
  onOpenSidebar: () => void;
}

export default function MobileNavbar({ onOpenSidebar }: MobileNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b bg-white/90 px-4 py-3 shadow-sm md:hidden backdrop-blur-md">
      <button
        type="button"
        aria-label="Open navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
        onClick={onOpenSidebar}
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      <div className="flex-1 text-center">
        <span className="text-sm font-semibold text-slate-900">
          Payment Dashboard
        </span>
      </div>

      {/* Right spacer for visual balance */}
      <div className="h-9 w-9" aria-hidden="true" />
    </header>
  );
}

