import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Renter } from 'src/app/interfaces/renter';
import { RenterService } from 'src/app/services/renter.service';

@Component({
    selector: 'app-account-status',
    templateUrl: './account-status.component.html',
    styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent implements OnInit {

    searchRenterControl = new FormControl('');
    listRenters: Renter[] = [];
    filteredRenters: Observable<Renter[]>;
    selectedRenter!: Renter;
    monthsToSum: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    totalBillPayment: number = 0;
    totalCapitalPayment: number = 0;

    @ViewChild('auto', { static: true }) auto!: MatAutocomplete;

    constructor(
        private _renterService: RenterService
    ) {
        this.filteredRenters = this.searchRenterControl.valueChanges.pipe(
            startWith(''),
            map(value => (value ? this._filterRenters(value) : this.listRenters.slice())),
        );
    }

    ngOnInit(): void {
        this.getRenters();
    }

    getRenters() {
        this._renterService.getRenters().subscribe({
            next: (resData) => {
                this.listRenters = resData.renters;
            },
            error: (err) => {
                console.log(<any>err);
            }
        });
    }

    private _filterRenters(value: string): Renter[] {
        if (typeof value !== 'string') {
            return this.listRenters.slice(); // Devuelve la lista completa si no hay un valor de búsqueda
        }

        const searchValue = value.toLowerCase();

        return this.listRenters.filter(renterOption => renterOption.name.toLowerCase().includes(searchValue) || renterOption.nit.toLowerCase().includes(searchValue));
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        this.selectedRenter = event.option.value;
        this.searchRenterControl.setValue(this.selectedRenter.name);

        this.totalBillPayment = 0;
        this.totalCapitalPayment = 0;
        this.calculateTotalBillPayment();
        this.calculateTotalCapitalPayment();
    }


    calculateTotalBillPayment(): void {
        const capitalPaymentsObject = this.selectedRenter.capital_payments;

        this.totalBillPayment = Object.values(capitalPaymentsObject)
            .map(monthData => monthData.bill)
            .reduce((acc, value) => acc + value, 0);

    }

    calculateTotalCapitalPayment(): void {
        const capitalPaymentsObject = this.selectedRenter.capital_payments;

        this.totalCapitalPayment = Object.values(capitalPaymentsObject)
            .map(monthData => monthData.capital_payment)
            .reduce((acc, value) => acc + value, 0);
    }
}
