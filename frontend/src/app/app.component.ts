import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from './services/snackbar.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'frontend';

    constructor(private _userService: UserService, private _snackbarService: SnackbarService) {
    }

    ngOnInit(): void {
        const token = localStorage.getItem('token');
        if (token) {
            this._userService.getUserByOwner(token).subscribe({
                next: (resData) => {
                    this._userService.setUserRole(resData.user.role);
                },
                error: (err: HttpErrorResponse) => {
                    this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al obtener el rol del usuario logueado");
                }
            });

        }
    }
}
