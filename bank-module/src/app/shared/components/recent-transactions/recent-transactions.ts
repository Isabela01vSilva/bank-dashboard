import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MoveRight,
  LucideAngularModule,
  BriefcaseBusiness,
  House,
  ShoppingBasket,
  CarTaxiFront,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-angular';

interface Transaction {
  title: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: any;
}
@Component({
  selector: 'app-recent-transactions',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './recent-transactions.html',
})
export class RecentTransactions {
  readonly MoveRight = MoveRight;

  readonly BriefcaseBusiness = BriefcaseBusiness;
  readonly House = House;
  readonly ShoppingBasket = ShoppingBasket;
  readonly CarTaxiFront = CarTaxiFront;

  readonly ArrowDownLeft = ArrowDownLeft;
  readonly ArrowUpRight = ArrowUpRight;

  transactions: Transaction[] = [
    {
      title: 'Salary',
      category: 'Work',
      date: 'Apr 15',
      amount: 8500,
      type: 'income',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Rent',
      category: 'Housing',
      date: 'Apr 14',
      amount: 2200,
      type: 'expense',
      icon: House,
    },
    {
      title: 'Groceries',
      category: 'Food',
      date: 'Apr 13',
      amount: 450.8,
      type: 'expense',
      icon: ShoppingBasket,
    },
    {
      title: 'Freelance',
      category: 'Work',
      date: 'Apr 12',
      amount: 3200,
      type: 'income',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Uber',
      category: 'Transport',
      date: 'Apr 11',
      amount: 35.5,
      type: 'expense',
      icon: CarTaxiFront,
    },
  ]

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
}
