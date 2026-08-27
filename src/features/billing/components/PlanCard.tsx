'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import type { plans } from '@/database/schema/billing';

type Plan = typeof plans.$inferSelect;

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
}

export function PlanCard({ plan, isCurrentPlan, isPopular }: PlanCardProps) {
  const price = Number(plan.priceVnd).toLocaleString('vi-VN');

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-card p-6 shadow-xs transition-all hover:shadow-md ${
        isPopular ? 'border-primary shadow-md ring-1 ring-primary/20' : ''
      } ${isCurrentPlan ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : ''}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Popular</span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">Current Plan</span>
        </div>
      )}

      <div className="mb-4 mt-2">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground"> VND</span>
        </div>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/dashboard/billing?plan=${plan.id}`}
        className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
          isCurrentPlan
            ? 'cursor-default bg-muted text-muted-foreground'
            : isPopular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
        onClick={(e) => isCurrentPlan && e.preventDefault()}
        aria-disabled={isCurrentPlan}
      >
        {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
      </Link>
    </div>
  );
}
