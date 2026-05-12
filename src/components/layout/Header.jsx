import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";

export function Header() {
  const { isAuthenticated, isAdmin, user, profile, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight text-cyan-300">ToolVerse</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className="text-sm text-slate-200 hover:text-cyan-300">Home</NavLink>
          <NavLink to="/tools" className="text-sm text-slate-200 hover:text-cyan-300">Marketplace</NavLink>
          {isAdmin && <NavLink to="/admin" className="text-sm text-slate-200 hover:text-cyan-300">Admin</NavLink>}
        </nav>

        {!isAuthenticated ? (
          <Button onClick={signInWithGoogle}>Continue with Google</Button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpen((current) => !current)}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-100"
            >
              <span>{profile?.full_name || user?.user_metadata?.full_name || user?.email}</span>
              {isAdmin && <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] text-cyan-200">ADMIN</span>}
              <ChevronDown className="h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
                {isAdmin && (
                  <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10" to="/admin" onClick={() => setOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
