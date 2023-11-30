import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private _snackBar: MatSnackBar) { }

    showErrorMessage(err: HttpErrorResponse, verticalPos: MatSnackBarVerticalPosition, pClass: string, secondaryMesage: string) {
        if (err.error.message) {
            this.snackbarMessage(err.error.message, verticalPos, pClass);
        } else {
            this.snackbarMessage(secondaryMesage, verticalPos, pClass);
        }
    }

    snackbarMessage(messageText: string, verticalPos: MatSnackBarVerticalPosition, pClass: string) {
        this._snackBar.open(messageText, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: verticalPos,
            panelClass: [pClass]
        });
    }
}
