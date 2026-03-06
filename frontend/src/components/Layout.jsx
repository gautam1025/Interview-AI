import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '240px' }}>
        <Navbar />
        {/* Added extra padding bottom to account for fixed footer */}
        <main className="flex-1 pb-24" style={{ paddingTop: '64px' }}>
          <div className="p-8 max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;