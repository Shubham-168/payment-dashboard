import { Outlet } from "react-router-dom"
import AppSidebar from "@/components/sidebar/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function App() {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full">
        <AppSidebar />

        {/* Main content */}
        <main className="realtive w-full min-h-screen pl-[40px]">
          <div className="w-full min-h-screen p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
