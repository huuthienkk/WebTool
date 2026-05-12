import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { categories } from "../data/categories";
import { isSupabaseConfigured } from "../lib/supabase";
import { deleteTool, getTools, upsertTool, uploadToBucket } from "../services/toolService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const initialForm = {
  id: undefined,
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category_slug: "productivity",
  category_name: "Productivity",
  is_premium: false,
  version: "1.0.0",
  installation_guide: "",
  usage_guide: "",
  changelog_raw: "",
  thumbnail_url: "",
  banner_url: "",
  download_url: "",
};

export function AdminPage() {
  const [tools, setTools] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [downloadFile, setDownloadFile] = useState(null);

  const load = () => getTools({ page: 1, category: "all" }).then((res) => setTools(res.tools));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured) return;

    let thumbnailUrl = form.thumbnail_url;
    let downloadUrl = form.download_url;

    if (thumbnailFile) thumbnailUrl = await uploadToBucket("thumbnails", thumbnailFile, "tool-");
    if (downloadFile) downloadUrl = await uploadToBucket("tool-files", downloadFile, "file-");

    const category = categories.find((item) => item.slug === form.category_slug);
    await upsertTool({
      id: form.id,
      title: form.title,
      slug: form.slug,
      short_description: form.short_description,
      description: form.description,
      category_slug: form.category_slug,
      category_name: category?.label || form.category_name,
      is_premium: form.is_premium,
      version: form.version,
      installation_guide: form.installation_guide,
      usage_guide: form.usage_guide,
      changelog: form.changelog_raw.split("\n").filter(Boolean),
      thumbnail_url: thumbnailUrl,
      banner_url: form.banner_url || thumbnailUrl,
      download_url: downloadUrl,
    });

    setForm(initialForm);
    setThumbnailFile(null);
    setDownloadFile(null);
    await load();
  };

  const remove = async (id) => {
    await deleteTool(id);
    await load();
  };

  return (
    <>
      <Seo title="Admin Dashboard | ToolVerse" description="Manage tools, categories, files, and premium toggles." />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="mb-5 text-3xl font-semibold">Admin Dashboard</h1>
          <form className="space-y-3" onSubmit={save}>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            <Input placeholder="Short description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} required />
            <textarea className="min-h-24 w-full rounded-xl border border-white/15 bg-black/30 p-3" placeholder="Detailed description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <select className="h-10 w-full rounded-xl border border-white/15 bg-black/30 px-3" value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })}>
              {categories.filter((item) => item.slug !== "all").map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
            </select>
            <Input placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            <textarea className="min-h-20 w-full rounded-xl border border-white/15 bg-black/30 p-3" placeholder="Installation guide" value={form.installation_guide} onChange={(e) => setForm({ ...form, installation_guide: e.target.value })} />
            <textarea className="min-h-20 w-full rounded-xl border border-white/15 bg-black/30 p-3" placeholder="Usage guide" value={form.usage_guide} onChange={(e) => setForm({ ...form, usage_guide: e.target.value })} />
            <textarea className="min-h-20 w-full rounded-xl border border-white/15 bg-black/30 p-3" placeholder="Changelog lines (one per line)" value={form.changelog_raw} onChange={(e) => setForm({ ...form, changelog_raw: e.target.value })} />
            <Input placeholder="Banner URL (optional)" value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
            <label className="block text-sm text-slate-300">Thumbnail file<input type="file" className="mt-2 block w-full text-sm" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} /></label>
            <label className="block text-sm text-slate-300">Downloadable file<input type="file" className="mt-2 block w-full text-sm" onChange={(e) => setDownloadFile(e.target.files?.[0] || null)} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} /> Premium tool</label>
            <Button type="submit"><Plus className="mr-2 h-4 w-4" />{form.id ? "Update Tool" : "Create Tool"}</Button>
          </form>
        </div>

        <div className="space-y-3">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-xs text-slate-400">{tool.category_name} • {tool.is_premium ? "Premium" : "Free"}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({
                    ...tool,
                    changelog_raw: (tool.changelog || []).join("\n"),
                  })}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => remove(tool.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

