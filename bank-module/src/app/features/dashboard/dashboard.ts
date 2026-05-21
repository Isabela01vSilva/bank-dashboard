import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { LucideAngularModule, Search, Bell, Eye, EyeOff } from 'lucide-angular';
import { StatCard } from "../../shared/components/stat-card/stat-card";
import { Chart } from "../../shared/components/chart/chart";

@Component({
  selector: 'app-dashboard',
  imports: [Header, LucideAngularModule, StatCard, Chart],
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
