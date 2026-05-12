import { categories } from "../../data/categories";
import { cn } from "../../lib/utils";

export function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onChange(category.slug)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition",
            value === category.slug
              ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-200"
              : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10",
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

