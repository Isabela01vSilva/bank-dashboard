import { Component, signal } from '@angular/core';

import {
  LucideAngularModule,
  LayoutDashboard,
  CalendarClock,
  ArrowLeftRight,
  CreditCard,
  History,
  Tags,
  FileBarChart2,
  BadgeDollarSign,
  Download,
  TriangleAlert,
  ArrowLeftToLine,
  ArrowRightFromLine,
  Wallet,
  Landmark,
  Copy,

} from 'lucide-angular';
import { MenuGroup } from './menu.interface';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuGroups: MenuGroup[] = [

    {
      title: 'Bank',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
        { label: 'Transações', icon: ArrowLeftRight, route: '/transactions' },
        { label: 'Agendamentos', icon: CalendarClock, route: '/schedules' },
        { label: 'Histórico', icon: History, route: '/history' },
      ],
    },
    {
      title: 'Cartões',
      items: [
        { label: 'Cartão', icon: CreditCard, route: '/cards' },
      ]
    },
    {
      title: 'Controle de Gastos',
      items: [
        { label: 'Gastos', icon: BadgeDollarSign, route: '/budgets' },
        { label: 'Categorias', icon: Tags, route: '/settings' },
        { label: 'Relatórios', icon: FileBarChart2, route: '/reports' },
        { label: 'Limites', icon: TriangleAlert, route: '/limits' },
        { label: 'Exportar', icon: Download, route: '/export' },
      ],
    },
  ];

  readonly ArrowLeftToLine = ArrowLeftToLine;
  readonly ArrowRightFromLine  = ArrowRightFromLine;
  readonly Wallet = Wallet;
  readonly Landmark = Landmark;
  readonly Copy = Copy;

  collapsed = signal(false);

  toggleSidebar() {
    this.collapsed.update((value) => !value);
  }
}
