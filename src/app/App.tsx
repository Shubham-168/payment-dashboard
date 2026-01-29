import { useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";


export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex">
            {/* Desktop sidebar overlay */}
            <DesktopSidebar />

            {/* Mobile sidebar drawer */}
            <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

            {/* Main content */}
            <main className="flex-1 md:pl-[40px] flex flex-col min-h-screen">
                {/* Mobile top navigation (FIXED) */}
                <MobileNavbar onOpenSidebar={() => setMobileOpen(true)} />

                {/* Page content */}
                <div className="flex-1 overflow-hidden p-4 md:p-6 pt-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}


// export default function App() {
//     const [mobileOpen, setMobileOpen] = useState(false);

//     return (
//         <div className="relative min-h-screen w-full bg-slate-50">
//             {/* Desktop sidebar overlay */}
//             <DesktopSidebar />

//             {/* Mobile sidebar drawer */}
//             <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

//             {/* Main content */}
//             <main className=" w-full md:pl-[40px] min-h-screen">
//                 {/* Mobile top navigation */}
//                 <MobileNavbar onOpenSidebar={() => setMobileOpen(true)} />

//                 <div className="w-full p-4 md:p-6 pt-16">
//                     <Outlet />
//                 </div>
//             </main>
//         </div>
//     );
// }
