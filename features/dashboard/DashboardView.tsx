"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BanknoteArrowDown, DollarSign, Package, ShoppingCart, Users, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatCard } from "@/components/ui/StatCard";
import { QuickSaleModal } from "@/features/quick-sales/QuickSaleModal";
import { getCustomers, getOrders, getProducts, getQuickSales } from "@/lib/store";
import { Order, Product, QuickSale } from "@/lib/types";
import { formatCurrency, formatDate, getOrderStatusBadge, getOrderStatusLabel, getPaymentMethodLabel, isToday } from "@/lib/utils";

export function DashboardView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [quickSales, setQuickSales] = useState<QuickSale[]>([]);
  const [openQuickSale, setOpenQuickSale] = useState(false);

  function refresh() {
    setProducts(getProducts());
    setOrders(getOrders());
    setCustomersCount(getCustomers().length);
    setQuickSales(getQuickSales());
  }

  useEffect(() => {
    refresh();
  }, []);

  const orderRevenue = useMemo(() => orders.reduce((sum, item) => sum + item.total, 0), [orders]);
  const quickSalesRevenue = useMemo(() => quickSales.reduce((sum, item) => sum + item.amount, 0), [quickSales]);
  const totalRevenue = orderRevenue + quickSalesRevenue;
  const quickSalesToday = useMemo(() => quickSales.filter((item) => isToday(item.createdAt)), [quickSales]);
  const cashToday = useMemo(() => {
    const todayOrders = orders.filter((item) => isToday(item.createdAt)).reduce((sum, item) => sum + item.total, 0);
    const todayQuick = quickSalesToday.reduce((sum, item) => sum + item.amount, 0);
    return todayOrders + todayQuick;
  }, [orders, quickSalesToday]);

  const totalProfit = useMemo(() => {
    const profitFromOrders = orders.reduce((sum, order) => {
      const orderProfit = order.items.reduce((itemSum, item) => {
        const product = products.find((productItem) => productItem.id === item.productId);
        if (!product) return itemSum;
        return itemSum + (product.salePrice - product.productionCost) * item.quantity;
      }, 0);
      return sum + orderProfit;
    }, 0);
    return profitFromOrders + quickSalesRevenue;
  }, [orders, products, quickSalesRevenue]);

  const recentOrders = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 4);
  const recentQuickSales = [...quickSales].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Dashboard" subtitle="Controle pedidos, clientes e o caixa do dia em um só lugar." />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/orders/new"><Button variant="secondary">Novo pedido</Button></Link>
          <Button onClick={() => setOpenQuickSale(true)}>
            <Zap className="mr-2 h-4 w-4" /> Registrar venda rápida
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Caixa de hoje" value={formatCurrency(cashToday)} icon={Wallet} description="Pedidos + vendas rápidas de hoje" />
        <StatCard title="Faturamento total" value={formatCurrency(totalRevenue)} icon={DollarSign} description="Pedidos e entradas rápidas" />
        <StatCard title="Lucro estimado" value={formatCurrency(totalProfit)} icon={BanknoteArrowDown} description="Com base nos produtos cadastrados" />
        <StatCard title="Produtos" value={String(products.length)} icon={Package} description="Itens cadastrados" />
        <StatCard title="Clientes" value={String(customersCount)} icon={Users} description="Base de clientes" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Últimos pedidos</h2>
            <Link href="/orders" className="text-sm font-medium text-brand-700">Ver todos</Link>
          </div>
          {recentOrders.length ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{order.customerName}</p>
                      <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getOrderStatusBadge(order.status)}>{getOrderStatusLabel(order.status)}</Badge>
                      <span className="font-bold text-slate-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={ShoppingCart} title="Sem pedidos ainda" description="Crie o primeiro pedido para começar a movimentar o sistema." action={<Link href="/orders/new"><Button>Novo pedido</Button></Link>} />
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Vendas rápidas / caixa</h2>
              <p className="text-sm text-slate-500">Entradas manuais para balcão, venda avulsa e caixa rápido.</p>
            </div>
            <Button size="sm" onClick={() => setOpenQuickSale(true)}>Nova venda</Button>
          </div>
          {recentQuickSales.length ? (
            <div className="space-y-3">
              {recentQuickSales.map((sale) => (
                <div key={sale.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{sale.description}</p>
                      <p className="text-sm text-slate-500">{formatDate(sale.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">{formatCurrency(sale.amount)}</p>
                      <p className="text-xs text-slate-500">{getPaymentMethodLabel(sale.paymentMethod)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Wallet} title="Nenhuma venda rápida" description="Use o botão acima para lançar vendas manuais no caixa do dia." action={<Button onClick={() => setOpenQuickSale(true)}>Registrar agora</Button>} />
          )}
          {quickSalesToday.length ? (
            <div className="mt-4 rounded-2xl bg-brand-50 p-4">
              <p className="text-sm text-slate-600">Entradas rápidas hoje</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">{formatCurrency(quickSalesToday.reduce((sum, item) => sum + item.amount, 0))}</p>
            </div>
          ) : null}
        </Card>
      </div>

      <QuickSaleModal open={openQuickSale} onClose={() => setOpenQuickSale(false)} onSaved={refresh} />
    </div>
  );
}
