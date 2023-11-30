import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent {

    loading = false;

    constructor(
        private _snackbarService: SnackbarService,
        private _userService: UserService,
        public dialogRef: MatDialogRef<DeleteUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    deleteUser() {
        this._userService.deleteUser(this.data._id).subscribe({
            next: (resData) => {
                this.fakeLoading();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al eliminar el usuario");
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
