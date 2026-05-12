import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function SearchBar({ value, onChange, placeholder = "Search desktop tools..." }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

