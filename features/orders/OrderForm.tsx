"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Textarea } from "@/components/ui/Textarea";
import { addOrder, getCustomers, getOrders, getProducts, updateOrder } from "@/lib/store";
import { Customer, Order, OrderItem, OrderStatus, PaymentMethod, Product } from "@/lib/types";
import { formatCurrency, generateId, numberValue, parseNumberInput } from "@/lib/utils";

const initialOrder: Order = {
  id: "",
  customerId: "",
  customerName: "",
  customerPhone: "",
  items: [],
  total: 0,
  status: "pendente",
  paymentMethod: "pix",
  notes: "",
  createdAt: new Date().toISOString()
};

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "pendente", label: "Pendente" },
  { value: "em_preparo", label: "Em preparo" },
  { value: "concluido", label: "Concluído" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" }
];

const paymentOptions: Array<{ value: PaymentMethod; label: string }> = [
  { value: "pix", label: "Pix" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "cartao_debito", label: "Cartão de débito" }
];

export function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState<Order>(initialOrder);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const editing = Boolean(id);

  useEffect(() => {
    setProducts(getProducts());
    setCustomers(getCustomers());
    if (!id) return;
    const found = getOrders().find((item) => item.id === id);
    if (found) setForm(found);
  }, [id]);

  const total = useMemo(() => form.items.reduce((sum, item) => sum + item.total, 0), [form.items]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, total }));
  }, [total]);

  function setCustomer(customerId: string) {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) {
      setForm((prev) => ({ ...prev, customerId: "", customerName: "", customerPhone: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, customerId: customer.id, customerName: customer.name, customerPhone: customer.phone }));
  }

  function addItem() {
    const product = products.find((item) => item.id === selectedProduct);
    if (!product || quantity <= 0) return;
    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.salePrice,
      total: product.salePrice * quantity
    };
    setForm((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setSelectedProduct("");
    setQuantity(1);
  }

  function removeItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function save() {
    if (!form.customerName || !form.items.length) return;
    if (editing) {
      updateOrder(form);
    } else {
      addOrder({ ...form, id: generateId("order"), createdAt: new Date().toISOString() });
    }
    router.push("/orders");
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title={editing ? "Editar pedido" : "Novo pedido"} subtitle="Monte o pedido e salve com total automático." />
        <Button variant="secondary" onClick={() => router.push("/orders")}>Voltar</Button>
      </div>

      <Card className="mx-auto w-full max-w-4xl p-5 md:p-6">
        <div className="grid gap-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cliente</label>
            <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={form.customerId} onChange={(e) => setCustomer(e.target.value)}>
              <option value="">Selecione</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_140px_auto]">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Produto</label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">Selecione</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name} - {formatCurrency(product.salePrice)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Qtd.</label>
              <Input type="number" value={numberValue(quantity)} onChange={(e) => setQuantity(Math.max(1, parseNumberInput(e.target.value)))} />
            </div>
            <div className="flex items-end"><Button onClick={addItem} className="w-full">Adicionar</Button></div>
          </div>

          <div className="space-y-3">
            {form.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <strong>{formatCurrency(item.total)}</strong>
                  <Button variant="destructive" size="sm" onClick={() => removeItem(index)}>Remover</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="text-sm text-slate-600">Total do pedido</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{formatCurrency(total)}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as OrderStatus }))}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Pagamento</label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={form.paymentMethod} onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}>{paymentOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Observações</label>
            <Textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Opcional" />
          </div>
          <Button onClick={save}>{editing ? "Salvar alterações" : "Criar pedido"}</Button>
        </div>
      </Card>
    </div>
  );
}
