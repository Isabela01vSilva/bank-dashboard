import { Route, Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { LucideAngularModule, Search, Bell, Eye, EyeOff } from 'lucide-angular';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { ChartLine } from '../../shared/components/chart-line/chart-line';
import { ChartDonut } from '../../shared/components/chart-donut/chart-donut';
import { RecentTransactions } from '../../shared/components/recent-transactions/recent-transactions';

@Component({
  selector: 'app-dashboard',
  imports: [Header, LucideAngularModule, StatCard, ChartLine, ChartDonut, RecentTransactions],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  constructor(private router: Router) {}

  isBalanceVisible = true;

  toggleVisibility() {
    this.isBalanceVisible = !this.isBalanceVisible;
  }

  pageTransation() {
    this.router.navigate(['/transactions']);
  }
}
