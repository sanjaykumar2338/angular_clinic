import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'clinic-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
  public suppliers: any[] = [];
  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getProviders().subscribe((res: any) => {
      this.suppliers = res.provider;
    });
  }
}
