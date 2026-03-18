"use client";

import { Menu, Candy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-brand-100 p-2 text-brand-700">
            <Candy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Doce Lucro</p>
            <p className="text-xs text-slate-500">Micro SaaS de gestão</p>
          </div>
        </div>
      </div>
    </header>
  );
}
