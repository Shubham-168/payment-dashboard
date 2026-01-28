import { NavLink } from "react-router-dom";
import { CreditCard, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

const menu = [
    { name: "Payment History", icon: CreditCard, path: "/payment-history" },
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Users", icon: Users, path: "/users" },
];

export default function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            className="bg-white border-r"
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menu.map((item) => (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild tooltip={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-[#2264E5] text-white shadow-sm"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            )
                                        }
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="whitespace-nowrap">
                                            {item.name}
                                        </span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
