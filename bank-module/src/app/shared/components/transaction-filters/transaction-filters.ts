import { Component } from '@angular/core';
import { PopoverModule, Popover } from 'primeng/popover';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-filters',
  imports: [Popover],
  templateUrl: './transaction-filters.html',
})
export class TransactionFilters {}
