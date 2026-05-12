import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ToolCard } from "../components/marketplace/ToolCard";
import { ToolCardSkeleton } from "../components/marketplace/ToolCardSkeleton";
import { Button } from "../components/ui/button";
import { getFeaturedTools } from "../services/toolService";

export function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    setLoadingFeatured(true);
    getFeaturedTools()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const stats = useMemo(() => ["200+ Tools", "50k+ Downloads", "12 Categories"], []);

  return (
    <>
      <Seo title="ToolVerse | Desktop Tool Marketplace" description="Discover premium and free desktop tools with polished installation guides." />
      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/15 via-slate-900/60 to-blue-600/10 p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" /> Curated SaaS-Style Desktop Stack
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">Ship faster with elite desktop tools.</h1>
              <p className="text-base text-slate-300 md:text-lg">Browse verified utilities, automation kits, and premium productivity apps with clear setup instructions.</p>
              <div className="flex gap-3">
                <Link to="/tools"><Button size="lg">Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-center text-sm text-slate-200">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Tools</h2>
          <Link to="/tools" className="text-sm text-cyan-300 hover:text-cyan-200">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loadingFeatured && Array.from({ length: 3 }).map((_, idx) => <ToolCardSkeleton key={idx} />)}
          {!loadingFeatured && featured.map((tool, idx) => <ToolCard key={tool.id} tool={tool} prioritizeImage={idx === 0} />)}
          {!loadingFeatured && !featured.length && <p className="text-slate-400">Add featured tools in Supabase to populate this section.</p>}
        </div>
      </section>
    </>
  );
}
