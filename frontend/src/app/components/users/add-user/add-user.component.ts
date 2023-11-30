import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { RenterFormService } from 'src/app/services/renter-form.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

    loading = false;
    hidePassword = true;
    hideRepeatPassword = true;
    roleValues = [{ value: 'ADMINISTRADOR' }, { value: 'TESORERO' }, { value: 'SUPERVISOR' }];
    userForm: FormGroup;
    userId: string | undefined;


    constructor(
        private fb: FormBuilder,
        private _snackbarService: SnackbarService,
        private _userService: UserService,
        private _renterFormService: RenterFormService,
        public dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            email: ['', [Validators.required, Validators.email]],
            role: [null, Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.userId = data._id;
    }


    addUser() {
        const user: User = {
            name: this.userForm.value.name.trim().toUpperCase(),
            email: this.userForm.value.email,
            role: this.userForm.value.role,
            password: this.userForm.value.password,
            repeatPassword: this.userForm.value.repeatPassword
        }

        this._userService.createUsers(user).subscribe({
            next: (resData) => {
                this.fakeLoading();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al crear el usuario");
            }
        });
    }


    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.dialogRef.close(true);
        }, 1300);
    }
}