import { useEffect, useMemo, useState } from "react";
import { Seo } from "../components/Seo";
import { CategoryFilter } from "../components/marketplace/CategoryFilter";
import { SearchBar } from "../components/marketplace/SearchBar";
import { ToolCard } from "../components/marketplace/ToolCard";
import { ToolCardSkeleton } from "../components/marketplace/ToolCardSkeleton";
import { Button } from "../components/ui/button";
import { getTools } from "../services/toolService";

export function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loadingTools, setLoadingTools] = useState(true);
  const [toolsData, setToolsData] = useState({ tools: [], total: 0, pageSize: 8 });

  useEffect(() => {
    setLoadingTools(true);
    getTools({ search, category, page })
      .then(setToolsData)
      .catch(() => setToolsData({ tools: [], total: 0, pageSize: 8 }))
      .finally(() => setLoadingTools(false));
  }, [search, category, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((toolsData.total || 0) / toolsData.pageSize)), [toolsData]);

  useEffect(() => setPage(1), [search, category]);

  return (
    <>
      <Seo title="Marketplace | ToolVerse" description="Browse desktop tools by category, search and compare free/premium picks." />
      <section className="mx-auto max-w-7xl space-y-6 px-4 pt-12">
        <h1 className="text-3xl font-semibold">Marketplace</h1>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingTools && Array.from({ length: 8 }).map((_, idx) => <ToolCardSkeleton key={idx} />)}
          {!loadingTools && toolsData.tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>

        {!loadingTools && !toolsData.tools.length && <p className="text-slate-400">No tools found.</p>}

        <div className="flex items-center justify-center gap-3 pt-6">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loadingTools}>Previous</Button>
          <span className="text-sm text-slate-300">Page {page} / {totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loadingTools}>Next</Button>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-300">AdSense Banner Placeholder (Responsive)</div>
      </section>
    </>
  );
}
