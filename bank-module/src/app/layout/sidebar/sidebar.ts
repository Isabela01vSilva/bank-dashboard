import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';

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
  Check,
} from 'lucide-angular';
import { MenuGroup } from './menu.interface';
import { timer } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuGroups: MenuGroup[] = [
    {
      title: 'Bank',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, route: '' },
        { label: 'Transações', icon: ArrowLeftRight, route: '/transactions' },
        /* { label: 'Agendamentos', icon: CalendarClock, route: '/schedules' },
        { label: 'Histórico', icon: History, route: '/history' }, */
      ],
    },
    /* {
      title: 'Cartões',
      items: [{ label: 'Cartão', icon: CreditCard, route: '/cards' }],
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
    }, */
  ];

  readonly ArrowLeftToLine = ArrowLeftToLine;
  readonly ArrowRightFromLine = ArrowRightFromLine;
  readonly Wallet = Wallet;
  readonly Landmark = Landmark;

  readonly Copy = Copy;
  readonly Check = Check;

  // Dentro da classe do componente:
  private cdr = inject(ChangeDetectorRef);

  ag = '0001';
  cc = '123456-7';
  copied = false;

  copyInfo() {
    this.copied = true;

    const text = `Ag ${this.ag} Cc ${this.cc}`;

    navigator.clipboard.writeText(text);

    timer(2000).subscribe(() => {
      this.copied = false;
      this.cdr.markForCheck(); //Avisa ao Angular que o estado mudou e precisa atualizar a view
    });
  }

  collapsed = signal(false);

  toggleSidebar() {
    this.collapsed.update((value) => !value);
  }
}
