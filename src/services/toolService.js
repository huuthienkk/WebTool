import { isSupabaseConfigured, supabase } from "../lib/supabase";

const PAGE_SIZE = 8;

function normalizeTool(tool) {
  return {
    ...tool,
    is_premium: Boolean(tool.is_premium),
    tags: tool.tags || [],
    changelog: tool.changelog || [],
  };
}

export async function getTools({ search = "", category = "all", page = 1 } = {}) {
  if (!isSupabaseConfigured) {
    return { tools: [], total: 0 };
  }

  let query = supabase
    .from("tools")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (category !== "all") query = query.eq("category_slug", category);
  if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return { tools: (data || []).map(normalizeTool), total: count || 0, pageSize: PAGE_SIZE };
}

export async function getFeaturedTools() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("is_featured", true)
    .limit(6)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeTool);
}

export async function getToolBySlug(slug) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("tools").select("*").eq("slug", slug).single();
  if (error) throw error;
  return normalizeTool(data);
}

export async function getRelatedTools({ categorySlug, excludeId }) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("category_slug", categorySlug)
    .neq("id", excludeId)
    .limit(4);
  if (error) throw error;
  return (data || []).map(normalizeTool);
}

export async function upsertTool(payload) {
  const { data, error } = await supabase.from("tools").upsert(payload).select().single();
  if (error) throw error;
  return normalizeTool(data);
}

export async function deleteTool(id) {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementDownload(toolId, userId) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("downloads").insert({ tool_id: toolId, user_id: userId || null });
  if (error) throw error;
}

export async function uploadToBucket(bucket, file, folder = "") {
  const ext = file.name.split(".").pop();
  const path = `${folder}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export { PAGE_SIZE };

