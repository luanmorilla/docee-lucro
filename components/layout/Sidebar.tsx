"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Candy, LayoutDashboard, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produtos", icon: ShoppingBag },
  { href: "/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/pricing", label: "Calculadora", icon: Calculator }
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open ? <div className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" onClick={onClose} /> : null}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="rounded-2xl bg-brand-100 p-2 text-brand-700">
            <Candy className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Doce Lucro</p>
            <p className="text-xs text-slate-500">Controle vendas e caixa</p>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {items.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
