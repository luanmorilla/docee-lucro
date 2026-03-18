"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Textarea } from "@/components/ui/Textarea";
import { addProduct, getProducts, updateProduct } from "@/lib/store";
import { Category, Product } from "@/lib/types";
import { generateId, numberValue, parseNumberInput } from "@/lib/utils";

const categoryOptions: Array<{ value: Category; label: string }> = [
  { value: "brigadeiro", label: "Brigadeiro" },
  { value: "bolo", label: "Bolo" },
  { value: "trufa", label: "Trufa" },
  { value: "ovo_colher", label: "Ovo de colher" },
  { value: "sobremesa", label: "Sobremesa" },
  { value: "outro", label: "Outro" }
];

const initialProduct: Product = {
  id: "",
  name: "",
  category: "outro",
  description: "",
  productionCost: 0,
  salePrice: 0,
  profitMargin: 0,
  stock: 0,
  unit: "unidade",
  imageUrl: "",
  createdAt: new Date().toISOString()
};

export function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState<Product>(initialProduct);
  const editing = Boolean(id);

  useEffect(() => {
    if (!id) return;
    const found = getProducts().find((item) => item.id === id);
    if (found) setForm(found);
  }, [id]);

  useEffect(() => {
    const margin = form.salePrice > 0 ? ((form.salePrice - form.productionCost) / form.salePrice) * 100 : 0;
    setForm((prev) => ({ ...prev, profitMargin: Number.isFinite(margin) ? Number(margin.toFixed(2)) : 0 }));
  }, [form.productionCost, form.salePrice]);

  function save() {
    if (!form.name.trim()) return;
    if (editing) {
      updateProduct(form);
    } else {
      addProduct({ ...form, id: generateId("product"), createdAt: new Date().toISOString() });
    }
    router.push("/products");
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title={editing ? "Editar produto" : "Novo produto"} subtitle="Todos os campos numéricos já estão ajustados para o zero sumir ao digitar." />
        <Button variant="secondary" onClick={() => router.push("/products")}>Voltar</Button>
      </div>

      <Card className="mx-auto w-full max-w-3xl p-5 md:p-6">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ex: Brigadeiro gourmet" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}>{categoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
            <Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descreva o produto" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Custo de produção</label>
              <Input type="number" step="0.01" value={numberValue(form.productionCost)} onChange={(e) => setForm((prev) => ({ ...prev, productionCost: parseNumberInput(e.target.value) }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Preço de venda</label>
              <Input type="number" step="0.01" value={numberValue(form.salePrice)} onChange={(e) => setForm((prev) => ({ ...prev, salePrice: parseNumberInput(e.target.value) }))} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Estoque</label>
              <Input type="number" value={numberValue(form.stock)} onChange={(e) => setForm((prev) => ({ ...prev, stock: parseNumberInput(e.target.value) }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Unidade</label>
              <Input value={form.unit} onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))} placeholder="unidade, kg, pote" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Margem de lucro</label>
            <Input value={`${form.profitMargin.toFixed(2)}%`} readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">URL da imagem</label>
            <Input value={form.imageUrl ?? ""} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="Opcional" />
          </div>
          <Button onClick={save}>{editing ? "Salvar alterações" : "Cadastrar produto"}</Button>
        </div>
      </Card>
    </div>
  );
}
