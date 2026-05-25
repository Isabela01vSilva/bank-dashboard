import { Component } from '@angular/core';
import { Header } from "../../layout/header/header";
import { LucideAngularModule, Plus, Filter, Upload, Search  } from "lucide-angular";

@Component({
  selector: 'app-page-transition',
  imports: [Header, LucideAngularModule],
  templateUrl: './page-transition.html',
})
export class PageTransition {
  readonly Plus = Plus;
  readonly Filter = Filter;
  readonly Upload = Upload;
  readonly Search = Search;
}
