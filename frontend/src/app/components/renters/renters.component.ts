import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Renter } from 'src/app/interfaces/renter';
import { RenterService } from 'src/app/services/renter.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeleteRenterComponent } from './delete-renter/delete-renter.component';

@Component({
    selector: 'app-renters',
    templateUrl: './renters.component.html',
    styleUrls: ['./renters.component.css']
})
export class RentersComponent implements OnInit {

    selectedRadioButtonValue: string = '1';
    listRenters: Renter[] = [];
    displayedColumns: string[] = ['name', 'nit', 'locations', 'internal_external', 'activity', 'payment_agreement_status', 'actions'];
    dataSource: MatTableDataSource<Renter>;

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private _renterService: RenterService,
        private _snackbarService: SnackbarService,
        public dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = "Registros por pagina";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Página siguiente";
        this.paginator._intl.lastPageLabel = "Última página";

        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

            length = Math.max(length, 0);

            const startIndex = page * pageSize;

            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;

            return `${startIndex + 1} – ${endIndex} de ${length}`;
        };

        this.getRenters();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getRenters() {
        this._renterService.getRenters().subscribe({
            next: (resData) => {
                this.listRenters = resData.renters;

                if (this.selectedRadioButtonValue !== '1') {
                    this.listRenters = this.listRenters.filter(renter => {
                        return renter.payment_agreement_status === this.getFilterStatus(this.selectedRadioButtonValue);
                    });
                }

                this.dataSource.data = this.listRenters;
            },
            error: (err) => {
                console.log(<any>err);
            }
        });
    }


    deleteRenterDialog(renterId: string, renterName: string) {
        const dialogRef = this.dialog.open(DeleteRenterComponent, {
            width: '600px',
            disableClose: false,
            data: { _id: renterId, name: renterName }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._snackbarService.snackbarMessage(`El arrendatario "${renterName}" ha sido eliminado`, "bottom", "gray-snackbar");
                this.getRenters();
            }
        });
    }


    setPaymentAgreementStatusClassStyles(paymentAgreementStatusValue: string) {
        
        if (paymentAgreementStatusValue == 'COMPLETADO') {
            return 'renter-column-value-green';
        } else if (paymentAgreementStatusValue == 'SIN COMPLETAR') {
            return 'renter-column-value-red';
        } else {
            return 'renter-column-value-gray';
        }
    }


    getFilterStatus(value: string): string {
        switch (value) {
            case '2':
                return 'COMPLETADO';
            case '3':
                return 'SIN COMPLETAR';
            case '4':
                return 'SIN ACUERDO';
            default:
                return '';
        }
    }
    
    onRadioButtonChange() {
        this.getRenters();
    }
}
