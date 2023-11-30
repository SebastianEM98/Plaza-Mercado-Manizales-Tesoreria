import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { RenterFormService } from 'src/app/services/renter-form.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

    operation = '';
    operationButton = '';
    loading = false;
    roleValues = [{ value: 'ADMINISTRADOR' }, { value: 'TESORERO' }, { value: 'SUPERVISOR' }];
    userForm: FormGroup;
    userId: string;
    action: string;

    constructor(
        private fb: FormBuilder,
        private _snackbarService: SnackbarService,
        private _userService: UserService,
        private _renterFormService: RenterFormService,
        public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            email: ['', [Validators.required, Validators.email]],
            role: [null, Validators.required]
        });

        this.userId = data._id;
        this.action = data.action;
    }


    ngOnInit(): void {
        this.determineAction(this.userId, this.action);
    }


    determineAction(userId: string, action: string) {
        if (action != 'view') {
            this.operation = "Editar";
            this.operationButton = "Guardar";
            this.userForm.get('email')?.disable();
            this.getUser(userId);
        } else {
            this.operation = "Ver";
            this.operationButton = "Aceptar";
            this.userForm.get('name')?.disable();
            this.userForm.get('email')?.disable();
            this.userForm.get('role')?.disable();
            this.getUser(userId);
        }
    }

    
    getUser(id: string) {
        this._userService.getUser(id).subscribe({
            next: (resData) => {
                this.userForm.setValue({
                    name: resData.user.name,
                    email: resData.user.email,
                    role: resData.user.role
                });
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al obtener el usuario");
            }
        });
    }


    editUser() {
        const user: User = {
            name: this.userForm.value.name.trim().toUpperCase(),
            email: this.userForm.value.email,
            role: this.userForm.value.role,
            password: '',
            repeatPassword: ''
        }

        if (this.action == 'edit') {
            this._userService.updateUser(this.userId, user).subscribe({
                next: (resData) => {
                    this.fakeLoading();
                },
                error: (err: HttpErrorResponse) => {
                    this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al modificar el usuario");
                }
            });
        } else {
            this.dialogRef.close(false);
        }
    }

    
    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.dialogRef.close(true);
        }, 1300);
    }
}
