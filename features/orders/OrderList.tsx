"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { deleteOrder, getOrders, updateOrder } from "@/lib/store";
import { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatDateOnly, getOrderStatusBadge, getOrderStatusLabel } from "@/lib/utils";

const statusOptions: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "em_preparo", label: "Em preparo" },
  { value: "concluido", label: "Concluído" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" }
];

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [toDelete, setToDelete] = useState<Order | null>(null);

  function refresh() {
    setOrders(getOrders());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = [...orders]
    .filter((item) => {
      const matchesSearch = item.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || item.status === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  function changeStatus(order: Order, nextStatus: OrderStatus) {
    updateOrder({ ...order, status: nextStatus });
    refresh();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Pedidos" subtitle="Controle os pedidos e o andamento de cada venda." />
        <Link href="/orders/new"><Button><Plus className="mr-2 h-4 w-4" />Novo pedido</Button></Link>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Buscar por cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}>{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{order.customerName}</h3>
                  <p className="text-sm text-slate-500">{formatDateOnly(order.createdAt)}</p>
                </div>
                <Badge className={getOrderStatusBadge(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {order.items.map((item, index) => <p key={`${item.productId}-${index}`}>{item.quantity}x {item.productName}</p>)}
              </div>
              <div className="mt-4 flex items-center justify-between"><span className="text-sm text-slate-500">Total</span><strong>{formatCurrency(order.total)}</strong></div>
              <div className="mt-4">
                <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" value={order.status} onChange={(e) => changeStatus(order, e.target.value as OrderStatus)}>
                  {statusOptions.filter((item) => item.value !== "all").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/orders/new?id=${order.id}`}><Button variant="secondary" className="w-full"><Edit className="mr-2 h-4 w-4" />Editar</Button></Link>
                <Button variant="destructive" onClick={() => setToDelete(order)}><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={ShoppingCart} title="Nenhum pedido encontrado" description="Crie um pedido para começar a usar o módulo." action={<Link href="/orders/new"><Button>Novo pedido</Button></Link>} />
      )}

      <Modal isOpen={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Excluir pedido" footer={<><Button variant="secondary" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={() => { if (toDelete) { deleteOrder(toDelete.id); refresh(); setToDelete(null); } }}>Excluir</Button></>}>
        <p className="text-sm text-slate-600">Tem certeza que deseja excluir o pedido de <strong>{toDelete?.customerName}</strong>?</p>
      </Modal>
    </div>
  );
}
