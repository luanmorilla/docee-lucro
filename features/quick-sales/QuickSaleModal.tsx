"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { addQuickSale } from "@/lib/store";
import { PaymentMethod, QuickSale } from "@/lib/types";
import { generateId, numberValue, parseNumberInput } from "@/lib/utils";

const methods: Array<{ value: PaymentMethod; label: string }> = [
  { value: "pix", label: "Pix" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "cartao_debito", label: "Cartão de débito" }
];

export function QuickSaleModal({
  open,
  onClose,
  onSaved
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Omit<QuickSale, "id" | "createdAt">>({
    description: "",
    amount: 0,
    paymentMethod: "pix",
    notes: ""
  });

  function reset() {
    setForm({ description: "", amount: 0, paymentMethod: "pix", notes: "" });
  }

  function handleSave() {
    if (!form.description.trim() || form.amount <= 0) {
      return;
    }

    addQuickSale({
      id: generateId("sale"),
      createdAt: new Date().toISOString(),
      ...form
    });
    reset();
    onSaved();
    onClose();
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Registrar venda rápida"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar venda</Button>
        </>
      }
    >
      <div className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
          <Input
            placeholder="Ex: Venda balcão - brigadeiro"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Valor</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 15"
            value={numberValue(form.amount)}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: parseNumberInput(e.target.value) }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Forma de pagamento</label>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
          >
            {methods.map((method) => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Observação</label>
          <Textarea
            placeholder="Opcional"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
}
