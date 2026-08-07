//AppLayout.jsx
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function AppLayout({
//   title,
//   description,
//   children,
// }) {
//   return (
//     <div className="flex h-screen bg-[#F6F8FC] overflow-hidden">
//       <Sidebar />

//       <div className="flex flex-col flex-1 min-w-0">
//         <Navbar
//           title={title}
//           description={description}
//         />

//         <main className="flex-1 p-6 overflow-auto min-w-0">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// AppLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout({
  title,
  description,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="h-screen bg-[#F6F8FC] flex overflow-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/40
            xl:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-w-0">

        <Navbar
          title={title}
          description={description}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className="
            flex-1
            overflow-auto
            p-4
            md:p-5
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}