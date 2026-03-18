export type Category =
  | "brigadeiro"
  | "bolo"
  | "trufa"
  | "ovo_colher"
  | "sobremesa"
  | "outro";

export type OrderStatus =
  | "pendente"
  | "em_preparo"
  | "concluido"
  | "entregue"
  | "cancelado";

export type PaymentMethod =
  | "pix"
  | "dinheiro"
  | "cartao_credito"
  | "cartao_debito";

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  productionCost: number;
  salePrice: number;
  profitMargin: number;
  stock: number;
  unit: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface QuickSale {
  id: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
}

export interface PricingResult {
  ingredientsCost: number;
  packagingCost: number;
  energyCost: number;
  extraCost: number;
  productionTime: number;
  desiredMargin: number;
  totalCost: number;
  idealPrice: number;
  estimatedProfit: number;
  profitPercentage: number;
}
