import { Component, signal } from '@angular/core';

import {
  LucideAngularModule,
  LayoutDashboard,
  CalendarClock,
  ArrowLeftRight,
  CreditCard,
  ChartColumn,
  Settings,
  History,
  Tags,
  FileBarChart2,
  BadgeDollarSign,
  Download,
  TriangleAlert,
  PanelLeftClose 
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly LayoutDashboard = LayoutDashboard;

  readonly ArrowLeftRight = ArrowLeftRight;

  readonly CalendarClock = CalendarClock;

  readonly CreditCard = CreditCard;

  readonly ChartColumn = ChartColumn;

  readonly Settings = Settings;

  readonly History = History;
  
  readonly Tags = Tags;

  readonly FileBarChart2 = FileBarChart2;

  readonly BadgeDollarSign = BadgeDollarSign;

  readonly Download = Download;

  readonly TriangleAlert = TriangleAlert;

  readonly PanelLeftClose = PanelLeftClose;

  collapsed = signal(false);

  toggleSidebar() {
    this.collapsed.update(value => !value);
  }
}
