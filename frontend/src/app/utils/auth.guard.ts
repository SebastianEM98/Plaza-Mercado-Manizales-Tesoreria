import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { SnackbarService } from '../services/snackbar.service';


export const authGuard: CanActivateFn = (route, state) => {

    const router = inject(Router);
    const location = inject(Location);
    const _userService = inject(UserService);
    const _snackbarService = inject(SnackbarService);

    const token = localStorage.getItem('token');
    let userRole;

    if (token) {
        if (route.url.length > 0) {
            let currentPath = route.url[0].path;

            _userService.getUserByOwner(token).subscribe({
                next: (resData) => {
                    userRole = resData.user.role;

                    if (userRole == 'ADMINISTRADOR') {
                        return true;
                        
                    } else if (userRole == 'TESORERO') {
                        if (currentPath == 'usuarios') {
                            _snackbarService.snackbarMessage("Permisos insuficientes", "bottom", "red-snackbar");
                            router.navigate(['usuario/ajustes']);
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        if (currentPath == 'usuarios') {
                            _snackbarService.snackbarMessage("Permisos insuficientes", "bottom", "red-snackbar");
                            router.navigate(['estado-cuenta']);
                            return false;
                        } else if (currentPath == 'central-abastos') {
                            _snackbarService.snackbarMessage("Permisos insuficientes", "bottom", "red-snackbar");
                            router.navigate(['estado-cuenta']);
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                error: (err: HttpErrorResponse) => {
                    _snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al cargar los datos del usuario logueado");
                }
            });
        }
    
        return true;
    } else {
        router.navigate(['login']);
        return false;
    }
};
