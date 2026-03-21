import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiCube } from "react-icons/hi2";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background with deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950" />

        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[10%] w-80 h-80 bg-indigo-500/[0.07] rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-emerald-500/[0.06] rounded-full blur-[100px] animate-float delay-1000" />
          <div className="absolute top-[55%] left-[40%] w-64 h-64 bg-violet-500/[0.05] rounded-full blur-[80px] animate-float delay-500" />
        </div>

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/20">
              <HiCube className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gradient">
              Inventra
            </h1>
          </div>

          <p className="text-lg text-slate-400 text-center max-w-sm leading-relaxed mb-12 animate-fade-in delay-150">
            Your intelligent inventory management system — streamlined, secure, and smart.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md w-full">
            {[
              { title: "Real-time", desc: "Stock Tracking", color: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/10", text: "text-indigo-400", delay: "delay-200" },
              { title: "Smart", desc: "Analytics", color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10", text: "text-emerald-400", delay: "delay-300" },
              { title: "Secure", desc: "Role-Based Access", color: "from-violet-500/10 to-violet-500/5 border-violet-500/10", text: "text-violet-400", delay: "delay-500" },
              { title: "Fast", desc: "Order Processing", color: "from-amber-500/10 to-amber-500/5 border-amber-500/10", text: "text-amber-400", delay: "delay-700" },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border backdrop-blur-sm animate-fade-in ${item.delay}`}
              >
                <div className={`text-xl font-bold ${item.text}`}>{item.title}</div>
                <div className="text-sm text-slate-400 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - auth forms */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/[0.03] rounded-full blur-[120px]" />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20">
              <HiCube className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gradient">
              Inventra
            </span>
          </div>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
