import { Component } from '@angular/core';
import { Header } from '../../layout/header/header';
import { LucideAngularModule, Search, Bell } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [Header, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly Search = Search;
  readonly Bell = Bell;
}
