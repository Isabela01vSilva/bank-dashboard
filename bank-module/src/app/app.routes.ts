import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { PageTransition } from './features/page-transition/page-transition';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'transactions',
    component: PageTransition
  }
];
