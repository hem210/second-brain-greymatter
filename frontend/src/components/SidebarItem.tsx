import type { ReactElement } from "react";

interface SidebarItemProps {
    text: string;
    icon: ReactElement;
    active?: boolean;
    onClick: () => void;
}

export function SidebarItem(props: SidebarItemProps) {
    const {text, icon, active, onClick} = props;
    return (
        <div
            className={`flex items-center gap-2 cursor-pointer rounded-lg transition-colors pl-4 max-w-48
            ${active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`} onClick={onClick}>
            {icon} {text}
        </div>
    );
}
