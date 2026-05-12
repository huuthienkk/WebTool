import { useEffect } from "react";

export function Seo({ title, description }) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector("meta[name='description']");
    if (meta) meta.setAttribute("content", description);
  }, [description, title]);

  return null;
}

