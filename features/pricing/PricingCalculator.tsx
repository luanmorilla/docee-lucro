"use client";

import { useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PricingResult } from "@/lib/types";
import { formatCurrency, numberValue, parseNumberInput } from "@/lib/utils";

export function PricingCalculator() {
  const [ingredientsCost, setIngredientsCost] = useState(0);
  const [packagingCost, setPackagingCost] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [extraCost, setExtraCost] = useState(0);
  const [productionTime, setProductionTime] = useState(0);
  const [desiredMargin, setDesiredMargin] = useState(50);
  const [result, setResult] = useState<PricingResult | null>(null);

  function calculate() {
    const totalCostBase = ingredientsCost + packagingCost + energyCost + extraCost;
    const labor = productionTime * 15;
    const totalCost = totalCostBase + labor;
    const idealPrice = desiredMargin >= 100 ? totalCost : totalCost / (1 - desiredMargin / 100);
    const estimatedProfit = idealPrice - totalCost;
    const profitPercentage = idealPrice > 0 ? (estimatedProfit / idealPrice) * 100 : 0;

    setResult({
      ingredientsCost,
      packagingCost,
      energyCost,
      extraCost,
      productionTime,
      desiredMargin,
      totalCost: Number(totalCost.toFixed(2)),
      idealPrice: Number(idealPrice.toFixed(2)),
      estimatedProfit: Number(estimatedProfit.toFixed(2)),
      profitPercentage: Number(profitPercentage.toFixed(2))
    });
  }

  function reset() {
    setIngredientsCost(0);
    setPackagingCost(0);
    setEnergyCost(0);
    setExtraCost(0);
    setProductionTime(0);
    setDesiredMargin(50);
    setResult(null);
  }

  return (
    <div className="grid gap-6">
      <SectionTitle title="Calculadora de preço" subtitle="Descubra o preço ideal com custos, mão de obra e margem desejada." />
      <Card className="mx-auto w-full max-w-3xl p-5 md:p-6">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Ingredientes</label>
            <Input type="number" step="0.01" value={numberValue(ingredientsCost)} onChange={(e) => setIngredientsCost(parseNumberInput(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Embalagem</label>
            <Input type="number" step="0.01" value={numberValue(packagingCost)} onChange={(e) => setPackagingCost(parseNumberInput(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gás / energia</label>
            <Input type="number" step="0.01" value={numberValue(energyCost)} onChange={(e) => setEnergyCost(parseNumberInput(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Custos extras</label>
            <Input type="number" step="0.01" value={numberValue(extraCost)} onChange={(e) => setExtraCost(parseNumberInput(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tempo de produção (horas)</label>
            <Input type="number" step="0.1" value={numberValue(productionTime)} onChange={(e) => setProductionTime(parseNumberInput(e.target.value))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Margem desejada (%)</label>
            <Input type="number" step="1" value={numberValue(desiredMargin)} onChange={(e) => setDesiredMargin(parseNumberInput(e.target.value))} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={calculate}><Calculator className="mr-2 h-4 w-4" />Calcular</Button>
            <Button variant="secondary" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Limpar</Button>
          </div>
        </div>

        {result ? (
          <div className="mt-6 rounded-2xl bg-brand-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Resultado</h3>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Custo total</span><strong>{formatCurrency(result.totalCost)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600">Preço ideal</span><strong>{formatCurrency(result.idealPrice)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600">Lucro estimado</span><strong>{formatCurrency(result.estimatedProfit)}</strong></div>
              <div className="flex justify-between"><span className="text-slate-600">Porcentagem de lucro</span><strong>{result.profitPercentage}%</strong></div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
