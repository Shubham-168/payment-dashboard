import { useState } from "react"
import { NavLink } from "react-router-dom"
import { CreditCard, LayoutDashboard, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const desktopMenu = [
  { name: "Payment History", icon: CreditCard, path: "/" },
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Users", icon: Users, path: "/users" },
]

export default function DesktopSidebar() {
  const [expanded, setExpanded] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "pointer-events-auto fixed inset-y-0 left-0 z-40 hidden h-screen flex-col border-r bg-white shadow-sm transition-[width] duration-200 md:flex",
          expanded ? "w-52" : "w-14"
        )}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <nav className="mt-4 flex flex-col gap-1 px-2">
          {desktopMenu.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-md px-2 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#2264E5] text-white hover:bg-[#1b54c7] hover:text-white"
                      : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                  )
                }
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          "group-hover:text-inherit"
                        )}
                      />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="right"
                    className="px-2 py-1 text-xs"
                    hidden={expanded}
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>

                <span
                  className={cn(
                    "ml-3 whitespace-nowrap text-[13px] transition-opacity duration-150",
                    expanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.name}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
