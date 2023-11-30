import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { RenterService } from 'src/app/services/renter.service';


@Component({
    selector: 'app-delete-renter',
    templateUrl: './delete-renter.component.html',
    styleUrls: ['./delete-renter.component.css']
})
export class DeleteRenterComponent {

    loading = false;

    constructor(
        private _snackbarService: SnackbarService,
        private _renterService: RenterService,
        public dialogRef: MatDialogRef<DeleteRenterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    deleteRenter() {
        this._renterService.deleteRenter(this.data._id).subscribe({
            next: (resData) => {
                this.fakeLoading();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al eliminar el arrendatario");
                this.dialogRef.close(false);
            }
        });
    }


    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.dialogRef.close(true);
        }, 1200);
    }
}
