import { Component, signal } from '@angular/core';
import {
  CalendarClock,
  LayoutDashboard,
  CreditCard,
  ChartColumn,
  LucideAngularModule,
  Settings,
  ArrowLeftRight,
} from 'lucide-angular';
import { Sidebar } from "./layout/sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [LucideAngularModule, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {


  protected readonly title = signal('bank-module');
}
