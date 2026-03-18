"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Plus, Search, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { deleteCustomer, getCustomers } from "@/lib/store";
import { Customer } from "@/lib/types";
import { formatDateOnly } from "@/lib/utils";

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Customer | null>(null);

  function refresh() {
    setCustomers(getCustomers());
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = customers.filter((item) => {
    const text = `${item.name} ${item.phone} ${item.address}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Clientes" subtitle="Base de clientes para pedidos e relacionamento." />
        <Link href="/customers/new"><Button><Plus className="mr-2 h-4 w-4" />Novo cliente</Button></Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input className="pl-9" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <Card key={customer.id} className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">{customer.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{customer.phone}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.address}</p>
              {customer.notes ? <p className="mt-3 text-sm text-slate-500">{customer.notes}</p> : null}
              <p className="mt-4 text-xs text-slate-400">Desde {formatDateOnly(customer.createdAt)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/customers/new?id=${customer.id}`}><Button variant="secondary" className="w-full"><Edit className="mr-2 h-4 w-4" />Editar</Button></Link>
                <Button variant="destructive" onClick={() => setToDelete(customer)}><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Users} title="Nenhum cliente encontrado" description="Cadastre clientes para usar nos pedidos." action={<Link href="/customers/new"><Button>Novo cliente</Button></Link>} />
      )}

      <Modal isOpen={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Excluir cliente" footer={<><Button variant="secondary" onClick={() => setToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={() => { if (toDelete) { deleteCustomer(toDelete.id); refresh(); setToDelete(null); } }}>Excluir</Button></>}>
        <p className="text-sm text-slate-600">Tem certeza que deseja excluir <strong>{toDelete?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
