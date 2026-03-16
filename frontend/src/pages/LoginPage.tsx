import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Toaster, sileo } from "sileo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: unknown) {
      sileo.error({
        title: "AUTH_FAILED",
        description: err instanceof Error ? err.message : "INVALID_CREDENTIALS",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-editorial { font-family: 'Playfair Display', serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }
        .brutal-border { border: 1px solid rgba(255,255,255,0.15); }
        .cyber-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            lineargradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>

      <div className="min-h-screen bg-black text-white font-tech selection:bg-cyan-500 selection:text-black flex flex-col items-center justify-center p-4 relative cyber-grid">
        
        <button 
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-8 right-8 text-[10px] text-white/50 hover:text-cyan-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
        >
          [ Return ]
        </button>

        <div className="flex flex-col items-center mb-10 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <img src="/aura-logo.svg" alt="AURA" className="w-8 h-8" />
            <span className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-lg">AURA</span>
          </div>
          <h1 className="font-editorial text-4xl italic font-black leading-[0.9] tracking-tighter text-white">
            System Access
          </h1>
        </div>

        <div className="w-full max-w-md brutal-border p-8 bg-black/80 backdrop-blur-md relative transform transition-transform hover:-translate-y-1 duration-500">
           <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
           <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>

           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
               <label htmlFor="email" className="text-[10px] md:text-xs uppercase text-white/60 tracking-[0.2em]">
                 <span className="text-cyan-500 mr-2">{'>'}</span> Email
               </label>
               <input 
                 id="email"
                 name="email"
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="bg-transparent brutal-border px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:text-cyan-500 transition-colors w-full rounded-none placeholder:text-white/20 focus:ring-1 focus:ring-cyan-500/50"
                 placeholder="sysadmin@aura.erp"
               />
             </div>

             <div className="flex flex-col gap-2">
               <div className="flex justify-between items-center">
                 <label htmlFor="password" className="text-[10px] md:text-xs uppercase text-white/60 tracking-[0.2em]">
                   <span className="text-cyan-500 mr-2">{'>'}</span> Password
                 </label>
               </div>
               <div className="relative">
                 <input 
                   id="password"
                   name="password"
                   type={showPassword ? "text" : "password"}
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="bg-transparent brutal-border px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:text-cyan-500 transition-colors w-full rounded-none placeholder:text-white/20 focus:ring-1 focus:ring-cyan-500/50"
                   placeholder="********"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/50 hover:text-cyan-500 tracking-[0.2em] uppercase transition-colors"
                 >
                   [{showPassword ? "Hide" : "Show"}]
                 </button>
               </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="mt-6 w-full py-4 text-xs font-bold uppercase tracking-[0.3em] bg-white text-black hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden brutal-border hover:border-cyan-500"
             >
               <span className="relative z-10 flex items-center gap-2">
                 {loading ? (
                    <>
                      <div className="w-2 h-2 bg-black animate-ping" />
                      Verifying...
                    </>
                 ) : (
                    <>Login</>
                 )}
               </span>
             </button>
           </form>
        </div>
      </div>
    </>
  );
}
