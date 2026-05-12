import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export function ToolCard({ tool, prioritizeImage = false }) {
  return (
    <Link to={`/tools/${tool.slug}`}>
      <Card className="group h-full transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/8">
        <img
          src={tool.thumbnail_url || "https://placehold.co/800x420/0f172a/38bdf8?text=Desktop+Tool"}
          alt={tool.title}
          className="h-44 w-full rounded-xl object-cover"
          loading={prioritizeImage ? "eager" : "lazy"}
          fetchPriority={prioritizeImage ? "high" : "auto"}
          decoding="async"
          width="800"
          height="420"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-100">{tool.title}</h3>
            <Badge tone={tool.is_premium ? "premium" : "free"}>{tool.is_premium ? "Premium" : "Free"}</Badge>
          </div>
          <p className="line-clamp-2 text-sm text-slate-300">{tool.short_description}</p>
          <div className="text-xs uppercase tracking-wide text-cyan-300/80">{tool.category_name}</div>
        </div>
      </Card>
    </Link>
  );
}
