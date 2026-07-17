import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { PageTransition } from './features/page-transition/page-transition';
import { AccountInquiryPage } from './features/account-inquiry-page/account-inquiry-page';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  { path: 'account',
    component: AccountInquiryPage },
  {
    path: 'transactions',
    component: PageTransition
  }
];
