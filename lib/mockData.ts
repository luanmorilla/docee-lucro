import { Customer, Order, Product, QuickSale } from "./types";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Brigadeiro Gourmet",
    category: "brigadeiro",
    description: "Brigadeiro cremoso com granulado belga",
    productionCost: 2.5,
    salePrice: 6,
    profitMargin: 58.33,
    stock: 120,
    unit: "unidade",
    createdAt: "2026-03-10T10:00:00.000Z"
  },
  {
    id: "p2",
    name: "Bolo de Cenoura",
    category: "bolo",
    description: "Bolo fofinho com cobertura de chocolate",
    productionCost: 28,
    salePrice: 65,
    profitMargin: 56.92,
    stock: 5,
    unit: "unidade",
    createdAt: "2026-03-10T11:00:00.000Z"
  },
  {
    id: "p3",
    name: "Mousse de Chocolate",
    category: "sobremesa",
    description: "Mousse aerado em pote de 200 ml",
    productionCost: 8,
    salePrice: 22,
    profitMargin: 63.64,
    stock: 15,
    unit: "pote 200ml",
    createdAt: "2026-03-11T09:00:00.000Z"
  }
];

export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Ana Paula Silva",
    phone: "(11) 99999-1111",
    address: "Rua das Flores, 123 - Centro",
    notes: "Prefere sem açúcar",
    createdAt: "2026-03-08T10:00:00.000Z"
  },
  {
    id: "c2",
    name: "Marcos Oliveira",
    phone: "(11) 98888-2222",
    address: "Av. Paulista, 456 - Bela Vista",
    notes: "Cliente recorrente",
    createdAt: "2026-03-09T10:00:00.000Z"
  }
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    customerId: "c1",
    customerName: "Ana Paula Silva",
    customerPhone: "(11) 99999-1111",
    items: [
      {
        productId: "p1",
        productName: "Brigadeiro Gourmet",
        quantity: 20,
        unitPrice: 6,
        total: 120
      }
    ],
    total: 120,
    status: "entregue",
    paymentMethod: "pix",
    notes: "Entregar até as 18h",
    createdAt: "2026-03-15T10:00:00.000Z"
  },
  {
    id: "o2",
    customerId: "c2",
    customerName: "Marcos Oliveira",
    customerPhone: "(11) 98888-2222",
    items: [
      {
        productId: "p2",
        productName: "Bolo de Cenoura",
        quantity: 1,
        unitPrice: 65,
        total: 65
      }
    ],
    total: 65,
    status: "em_preparo",
    paymentMethod: "dinheiro",
    notes: "",
    createdAt: "2026-03-16T14:00:00.000Z"
  }
];

export const mockQuickSales: QuickSale[] = [
  {
    id: "qs1",
    description: "Venda balcão - 2 brigadeiros",
    amount: 12,
    paymentMethod: "pix",
    notes: "Venda rápida",
    createdAt: new Date().toISOString()
  }
];
