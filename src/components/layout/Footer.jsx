export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} ToolVerse. Built for desktop productivity.</p>
        <p>Reserved AdSense placement area • 728x90</p>
      </div>
    </footer>
  );
}

