import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { LucideAngularModule, Search, Bell, Eye, EyeOff } from 'lucide-angular';
import { StatCard } from "../../shared/components/stat-card/stat-card";
import { ChartLine } from "../../shared/components/chart-line/chart-line";
import { ChartDonut } from "../../shared/components/chart-donut/chart-donut";

@Component({
  selector: 'app-dashboard',
  imports: [Header, LucideAngularModule, StatCard, ChartLine, ChartDonut],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  isBalanceVisible = true;

  toggleVisibility() {
    this.isBalanceVisible = !this.isBalanceVisible;
  }
}
