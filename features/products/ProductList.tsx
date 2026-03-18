"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Edit, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { deleteProduct, getProducts } from "@/lib/store";
import { Category, Product } from "@/lib/types";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";

const categories: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "brigadeiro", label: "Brigadeiro" },
  { value: "bolo", label: "Bolo" },
  { value: "trufa", label: "Trufa" },
  { value: "ovo_colher", label: "Ovo de colher" },
  { value: "sobremesa", label: "Sobremesa" },
  { value: "outro", label: "Outro" }
];

export function ProductList() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [toDelete, setToDelete] = useState<Product | null>(null);

  function refresh() {
    setItems(getProducts());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Produtos" subtitle="Cadastre, filtre e ajuste seus doces." />
        <Link href="/products/new"><Button><Plus className="mr-2 h-4 w-4" />Novo produto</Button></Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={category} onChange={(e) => setCategory(e.target.value as Category | "all")}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <Card key={product.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{getCategoryLabel(product.category)}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{product.stock} {product.unit}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{product.description || "Sem descrição"}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Custo</span><strong>{formatCurrency(product.productionCost)}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Venda</span><strong>{formatCurrency(product.salePrice)}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Margem</span><strong>{product.profitMargin.toFixed(2)}%</strong></div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href={`/products/new?id=${product.id}`}><Button variant="secondary" className="w-full"><Edit className="mr-2 h-4 w-4" />Editar</Button></Link>
                <Button variant="destructive" onClick={() => setToDelete(product)}><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Boxes} title="Nenhum produto encontrado" description="Cadastre seu primeiro produto ou ajuste os filtros." action={<Link href="/products/new"><Button>Novo produto</Button></Link>} />
      )}

      <Modal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Excluir produto"
        footer={<><Button variant="secondary" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={() => { if (toDelete) { deleteProduct(toDelete.id); refresh(); setToDelete(null); } }}>Excluir</Button></>}
      >
        <p className="text-sm text-slate-600">Tem certeza que deseja excluir <strong>{toDelete?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
