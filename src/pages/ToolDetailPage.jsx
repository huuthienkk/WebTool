import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { Seo } from "../components/Seo";
import { ToolCard } from "../components/marketplace/ToolCard";
import { ToolCardSkeleton } from "../components/marketplace/ToolCardSkeleton";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import { getRelatedTools, getToolBySlug, incrementDownload } from "../services/toolService";

export function ToolDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [tool, setTool] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getToolBySlug(slug)
      .then((item) => {
        setTool(item);
        return getRelatedTools({ categorySlug: item.category_slug, excludeId: item.id });
      })
      .then(setRelated)
      .catch(() => {
        setTool(null);
        setRelated([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12" aria-busy="true" aria-live="polite">
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>
    );
  }

  if (!tool) return <div className="mx-auto max-w-5xl px-4 py-16 text-slate-300">Tool not found.</div>;

  const onDownload = async () => {
    await incrementDownload(tool.id, user?.id);
    if (tool.download_url) window.open(tool.download_url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo title={`${tool.title} | ToolVerse`} description={tool.short_description} />
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-12">
        <img
          src={tool.banner_url || tool.thumbnail_url}
          alt={tool.title}
          className="h-72 w-full rounded-3xl object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1200"
          height="480"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-semibold">{tool.title}</h1>
          <Badge tone={tool.is_premium ? "premium" : "free"}>{tool.is_premium ? "Premium" : "Free"}</Badge>
        </div>

        <p className="text-slate-300">{tool.description}</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4"><h3 className="mb-2 text-sm text-cyan-300">Version</h3><p>{tool.version || "1.0.0"}</p></div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4"><h3 className="mb-2 text-sm text-cyan-300">Category</h3><p>{tool.category_name}</p></div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4"><h3 className="mb-2 text-sm text-cyan-300">Compatibility</h3><p>{tool.compatibility || "Windows / macOS"}</p></div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Installation Guide</h2>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-slate-300">{tool.installation_guide || "1. Download the package\n2. Extract file\n3. Run setup executable"}</pre>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Usage Guide</h2>
          <p className="text-slate-300">{tool.usage_guide || "Launch the tool and follow on-screen setup prompts."}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Changelog</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            {(tool.changelog || ["Initial release"]).map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <Button onClick={onDownload} size="lg"><Download className="mr-2 h-4 w-4" />Download</Button>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Related Tools</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {related.length ? related.map((item) => <ToolCard key={item.id} tool={item} />) : Array.from({ length: 2 }).map((_, idx) => <ToolCardSkeleton key={idx} />)}
          </div>
        </div>
      </section>
    </>
  );
}
