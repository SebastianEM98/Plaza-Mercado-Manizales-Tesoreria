import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modules
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

// Components
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RentersComponent } from './components/renters/renters.component';
import { AddRenterComponent } from './components/renters/add-renter/add-renter.component';
import { ViewRenterComponent } from './components/renters/view-renter/view-renter.component';
import { EditRenterComponent } from './components/renters/edit-renter/edit-renter.component';
import { DeleteRenterComponent } from './components/renters/delete-renter/delete-renter.component';
import { AccountStatusComponent } from './components/account-status/account-status.component';
import { UsersComponent } from './components/users/users.component';
import { AddTokenInterceptor } from './utils/add-token.interceptor';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { EditUserOwnerComponent } from './components/users/edit-user-owner/edit-user-owner.component';
import { DeleteUserComponent } from './components/users/delete-user/delete-user.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// Directives
import { MoneyFormatDirective } from './utils/money-format.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RentersComponent,
    AddRenterComponent,
    ViewRenterComponent,
    EditRenterComponent,
    DeleteRenterComponent,
    NavbarComponent,
    AccountStatusComponent,
    UsersComponent,
    AddUserComponent,
    EditUserComponent,
    EditUserOwnerComponent,
    DeleteUserComponent,
    NotFoundComponent,
    MoneyFormatDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
