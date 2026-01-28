import { NavLink } from "react-router-dom"
import { CreditCard, LayoutDashboard, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"

const menu = [
    { name: "Payment History", icon: CreditCard, path: "/payment-history" },
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Users", icon: Users, path: "/users" },
]

export default function AppSidebar() {
    const { setOpen } = useSidebar()

    return (
        <Sidebar
            collapsible="icon"
            className="fixed left-0 top-0 z-50 h-screen w-[40px] hover:w-[200px] transition-all duration-300 overflow-hidden bg-white border-r"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menu.map((item) => (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 rounded-md p-2 transition",
                                                isActive
                                                    ? "bg-[#2264E5] text-white"
                                                    : "hover:bg-slate-200"
                                            )
                                        }
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
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
    )
}
