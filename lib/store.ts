"use client";

import { mockCustomers, mockOrders, mockProducts, mockQuickSales } from "./mockData";
import { Customer, Order, Product, QuickSale } from "./types";

const KEYS = {
  products: "doce_lucro_products",
  customers: "doce_lucro_customers",
  orders: "doce_lucro_orders",
  quickSales: "doce_lucro_quick_sales"
};

function load<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function getProducts() {
  return load<Product>(KEYS.products, mockProducts);
}
export function addProduct(product: Product) {
  save(KEYS.products, [...getProducts(), product]);
}
export function updateProduct(updated: Product) {
  save(KEYS.products, getProducts().map((item) => (item.id === updated.id ? updated : item)));
}
export function deleteProduct(id: string) {
  save(KEYS.products, getProducts().filter((item) => item.id !== id));
}

export function getCustomers() {
  return load<Customer>(KEYS.customers, mockCustomers);
}
export function addCustomer(customer: Customer) {
  save(KEYS.customers, [...getCustomers(), customer]);
}
export function updateCustomer(updated: Customer) {
  save(KEYS.customers, getCustomers().map((item) => (item.id === updated.id ? updated : item)));
}
export function deleteCustomer(id: string) {
  save(KEYS.customers, getCustomers().filter((item) => item.id !== id));
}

export function getOrders() {
  return load<Order>(KEYS.orders, mockOrders);
}
export function addOrder(order: Order) {
  save(KEYS.orders, [...getOrders(), order]);
}
export function updateOrder(updated: Order) {
  save(KEYS.orders, getOrders().map((item) => (item.id === updated.id ? updated : item)));
}
export function deleteOrder(id: string) {
  save(KEYS.orders, getOrders().filter((item) => item.id !== id));
}

export function getQuickSales() {
  return load<QuickSale>(KEYS.quickSales, mockQuickSales);
}
export function addQuickSale(sale: QuickSale) {
  save(KEYS.quickSales, [sale, ...getQuickSales()]);
}
export function deleteQuickSale(id: string) {
  save(KEYS.quickSales, getQuickSales().filter((item) => item.id !== id));
}
