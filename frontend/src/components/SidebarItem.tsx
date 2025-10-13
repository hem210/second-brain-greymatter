import type { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  active?: boolean;
  onClick: () => void;
}

export function SidebarItem({ text, icon, active, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 w-full cursor-pointer rounded-md transition-colors select-none
        ${
          active
            ? "bg-gray-100 text-gray-900 font-medium shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <span className="truncate">{text}</span>
    </div>
  );
}
