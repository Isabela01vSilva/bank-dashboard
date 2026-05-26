import { Component } from '@angular/core';
import { Header } from "../../layout/header/header";
import { LucideAngularModule, Plus, Filter, Upload, Search  } from "lucide-angular";
import { RecentTransactions } from "../../shared/components/recent-transactions/recent-transactions";
import { TransactionFilters } from "../../shared/components/transaction-filters/transaction-filters";

@Component({
  selector: 'app-page-transition',
  imports: [Header, LucideAngularModule, RecentTransactions, TransactionFilters],
  templateUrl: './page-transition.html',
})
export class PageTransition {
  readonly Plus = Plus;
  readonly Filter = Filter;
  readonly Upload = Upload;
  readonly Search = Search;
}
