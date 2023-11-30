import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/login/login.component';
import { RentersComponent } from './components/renters/renters.component';
import { AccountStatusComponent } from './components/account-status/account-status.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserOwnerComponent } from './components/users/edit-user-owner/edit-user-owner.component';
import { AddRenterComponent } from './components/renters/add-renter/add-renter.component';
import { ViewRenterComponent } from './components/renters/view-renter/view-renter.component';
import { EditRenterComponent } from './components/renters/edit-renter/edit-renter.component';

// Guards
import { authGuard } from './utils/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'central-abastos', component: RentersComponent, canActivate: [authGuard] },
    { path: 'central-abastos/crear-arrendatario', component: AddRenterComponent, canActivate: [authGuard] },
    { path: 'central-abastos/ver-arrendatario/:id', component: ViewRenterComponent, canActivate: [authGuard] },
    { path: 'central-abastos/editar-arrendatario/:id', component: EditRenterComponent, canActivate: [authGuard] },
    { path: 'estado-cuenta', component: AccountStatusComponent, canActivate: [authGuard] },
    { path: 'usuarios', component: UsersComponent, canActivate: [authGuard] },
    { path: 'usuario/ajustes', component: EditUserOwnerComponent, canActivate: [authGuard] },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
