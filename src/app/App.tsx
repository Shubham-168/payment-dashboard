import { useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";

export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const scrollbarStyle = {
        "&::-webkit-scrollbar": {
            width: "6px"
        },
        "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8"
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-50">
            {/* Desktop sidebar overlay */}
            <DesktopSidebar />

            {/* Mobile sidebar drawer */}
            <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

            {/* Main content */}
            <main className="relative w-full md:pl-[40px] min-h-screen">
                {/* Mobile top navigation */}
                <MobileNavbar onOpenSidebar={() => setMobileOpen(true)} />

                <div className="w-full min-h-screen p-4 md:p-6 pt-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
