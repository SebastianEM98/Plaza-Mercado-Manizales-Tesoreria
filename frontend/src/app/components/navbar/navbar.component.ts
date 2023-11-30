import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    loading = false;
    userName = '';
    userRole = '';
    token: string;


    constructor(private router: Router, private _userService: UserService, private _snackbarService: SnackbarService) {
        this.token = localStorage.getItem('token') || '';

        this._userService.userRole$.subscribe(role => {
            this.userRole = role;
        });
    }

    ngOnInit(): void {
        this.getCurrentUser(this.token);
        this.userRole = this._userService.getUserRole();
    }

    getCurrentUser(token: string) {
        this._userService.getUserByOwner(token).subscribe({
            next: (resData) => {
                this.userName = resData.user.name;
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al cargar los datos del usuario logueado");
            }
        });
    }

    logout() {
        localStorage.removeItem('token');
        this.fakeLoading();
    }

    fakeLoading() {
        this.loading = true;
        setTimeout(() => {
            this.router.navigate(['login']);
        }, 1000);
    }
}
