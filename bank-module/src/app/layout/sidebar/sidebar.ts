import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Icons } from '../../shared/icon/icons.const';
import { MenuGroup } from './menu.interface';
import { timer } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly Icons = Icons;

  menuGroups: MenuGroup[] = [
    {
      title: 'Bank',
      items: [
        { label: 'Dashboard', icon: Icons.LayoutDashboard, route: '' },
        { label: 'Consulta de Conta', icon: Icons.Wallet, route: '/account' },
        { label: 'Transações', icon: Icons.ArrowLeftRight, route: '/transactions' },
      ],
    },
  ];

  private destroyRef = inject(DestroyRef);

  ag = '0001';
  cc = '123456-7';
  copied = signal(false);

  copyInfo(): void {
    this.copied.set(true);
    navigator.clipboard.writeText(`Ag ${this.ag} Cc ${this.cc}`);

    timer(2000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.copied.set(false));
  }

  collapsed = signal(false);

  toggleSidebar(): void {
    this.collapsed.update((value) => !value);
  }
}
