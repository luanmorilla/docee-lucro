"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Textarea } from "@/components/ui/Textarea";
import { addCustomer, getCustomers, updateCustomer } from "@/lib/store";
import { Customer } from "@/lib/types";
import { generateId } from "@/lib/utils";

const initialCustomer: Customer = {
  id: "",
  name: "",
  phone: "",
  address: "",
  notes: "",
  createdAt: new Date().toISOString()
};

export function CustomerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState<Customer>(initialCustomer);
  const editing = Boolean(id);

  useEffect(() => {
    if (!id) return;
    const found = getCustomers().find((item) => item.id === id);
    if (found) setForm(found);
  }, [id]);

  function save() {
    if (!form.name.trim()) return;
    if (editing) {
      updateCustomer(form);
    } else {
      addCustomer({ ...form, id: generateId("customer"), createdAt: new Date().toISOString() });
    }
    router.push("/customers");
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title={editing ? "Editar cliente" : "Novo cliente"} subtitle="Cadastre clientes para seus pedidos." />
        <Button variant="secondary" onClick={() => router.push("/customers")}>Voltar</Button>
      </div>
      <Card className="mx-auto w-full max-w-3xl p-5 md:p-6">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
            <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Telefone</label>
            <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Endereço</label>
            <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Observações</label>
            <Textarea value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
          </div>
          <Button onClick={save}>{editing ? "Salvar alterações" : "Cadastrar cliente"}</Button>
        </div>
      </Card>
    </div>
  );
}
