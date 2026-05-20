import { Component, Input } from '@angular/core';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  imports: [LucideAngularModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() value!: string;
  @Input() icon!: 'income' | 'expense' | 'balance';

  cardConfig = {
    income: {
      icon: TrendingUp,
      bg: 'bg-green-500',
    },

    expense: {
      icon: TrendingDown,
      bg: 'bg-red-500',
    },

    balance: {
      icon: Wallet,
      bg: 'bg-violet-500',
    },
  };

  get config() {
    return this.cardConfig[this.icon];
  }
}
