import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private _snackbarService: SnackbarService,
        private _userService: UserService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required]
        })
    }


    ngOnInit(): void {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
        }
    }


    login() {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;

        const user = {
            email: email,
            password: password
        };

        this._userService.login(user).subscribe({
            next: (data) => {
                const token = (data as any).token;
                localStorage.setItem('token', token);
                this.proceedAccess(token);
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "top", "red-snackbar", "Ha ocurrido un error al iniciar sesión");
                this.loginForm.reset();
            }
        }); 
    }
    

    proceedAccess(token: string) {
        this._userService.getUserByOwner(token).subscribe({
            next: (resData) => {
                this._userService.setUserRole(resData.user.role);
                const userRole = this._userService.getUserRole();
                if (userRole == 'SUPERVISOR') {
                    this.fakeLoading('estado-cuenta');
                } else {
                    this.fakeLoading('central-abastos');
                }
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al obtener el rol del usuario logueado");
            }
        });
    }


    fakeLoading(path: string) {
        this.loading = true;
        setTimeout(() => {
            this.router.navigate([path]);
        }, 1500);
    }
}
