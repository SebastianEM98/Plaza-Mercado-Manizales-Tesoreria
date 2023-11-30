import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { RenterFormService } from 'src/app/services/renter-form.service';

@Component({
    selector: 'app-edit-user-owner',
    templateUrl: './edit-user-owner.component.html',
    styleUrls: ['./edit-user-owner.component.css']
})
export class EditUserOwnerComponent implements OnInit {

    token: string;
    loading = false;
    hideOldPassword = true;
    hidePassword = true;
    hideRepeatPassword = true;
    userForm: FormGroup;
    passwordForm: FormGroup;
    roleValues = [{ value: 'ADMINISTRADOR' }, { value: 'TESORERO' }, { value: 'SUPERVISOR' }];
    userId: string = '';
    operationMessage: string = '';


    constructor(
        private fb: FormBuilder,
        private _snackbarService: SnackbarService,
        private _userService: UserService,
        private _renterFormService: RenterFormService,
        private location: Location
    ) {
        this.userForm = this.fb.group({
            name: ['', [Validators.required, this._renterFormService.noWhitespaceValidator()]],
            email: ['', [Validators.required, Validators.email]],
            role: [null, Validators.required]
        });

        this.passwordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.token = localStorage.getItem('token') || '';
    }


    ngOnInit(): void {
        this.getUserOwner(this.token);
        this.userForm.get('role')?.disable();
    }


    getUserOwner(token: string) {
        this._userService.getUserByOwner(token).subscribe({
            next: (resData) => {
                this.userForm.setValue({
                    name: resData.user.name,
                    email: resData.user.email,
                    role: resData.user.role
                });
                this.userId = resData.user._id;
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al cargar los datos del usuario logueado");
            }
        });
    }


    updateUser() {
        const user: User = {
            name: this.userForm.value.name.trim().toUpperCase(),
            email: this.userForm.value.email,
            role: this.userForm.value.role,
            password: '',
            repeatPassword: ''
        }

        this._userService.updateUserByOwner(this.userId, user).subscribe({
            next: (resData) => {
                this.operationMessage = 'Información actualizada exitosamente';
                this.fakeLoading();
                const newToken = (resData as any).token;
                localStorage.setItem('token', newToken);

            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al modificar el usuario");
            }
        });
    }


    changePassword() {
        const userPassword = {
            oldPassword: this.passwordForm.value.oldPassword,
            newPassword: this.passwordForm.value.newPassword,
            repeatNewPassword: this.passwordForm.value.repeatNewPassword
        }

        this._userService.changeUserPassword(this.userId, userPassword).subscribe({
            next: (resData) => {
                this.operationMessage = 'Contraseña actualizada';
                this.fakeLoading();
                this.resetPasswordForm();
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al cambiar la contraseña");
            }
        });
    }


    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this._snackbarService.snackbarMessage(this.operationMessage, "bottom", "green-snackbar");
        }, 1300);
    }


    resetPasswordForm() {
        this.passwordForm.reset();
        this.passwordForm.get('oldPassword')?.setErrors(null);
        this.passwordForm.get('newPassword')?.setErrors(null);
        this.passwordForm.get('repeatNewPassword')?.setErrors(null);
    }


    goBack() {
        this.location.back();
    }
}
