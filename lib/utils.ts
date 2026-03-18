import { Category, OrderStatus, PaymentMethod } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

export function formatDateOnly(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(iso));
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    brigadeiro: "Brigadeiro",
    bolo: "Bolo",
    trufa: "Trufa",
    ovo_colher: "Ovo de colher",
    sobremesa: "Sobremesa",
    outro: "Outro"
  };
  return labels[category];
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pendente: "Pendente",
    em_preparo: "Em preparo",
    concluido: "Concluído",
    entregue: "Entregue",
    cancelado: "Cancelado"
  };
  return labels[status];
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    pix: "Pix",
    dinheiro: "Dinheiro",
    cartao_credito: "Cartão de crédito",
    cartao_debito: "Cartão de débito"
  };
  return labels[method];
}

export function getOrderStatusBadge(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pendente: "bg-amber-100 text-amber-700",
    em_preparo: "bg-sky-100 text-sky-700",
    concluido: "bg-emerald-100 text-emerald-700",
    entregue: "bg-violet-100 text-violet-700",
    cancelado: "bg-rose-100 text-rose-700"
  };
  return map[status];
}

export function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseNumberInput(value: string): number {
  if (!value.trim()) return 0;
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function numberValue(value: number): string | number {
  return value === 0 ? "" : value;
}
