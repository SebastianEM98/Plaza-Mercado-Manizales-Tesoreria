import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { AddUserComponent } from './add-user/add-user.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    token: string;
    loggedInUserId: string = '';
    listUsers: User[] = [];
    displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
    dataSource: MatTableDataSource<User>;

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private _userService: UserService,
        private _snackbarService: SnackbarService,
        public dialog: MatDialog
    ) {
        this.dataSource = new MatTableDataSource();
        this.token = localStorage.getItem('token') || '';
    }

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = "Registros por pagina";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Página siguiente";
        this.paginator._intl.lastPageLabel = "Última página";

        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) { return `0 de ${length}`; }
    
            length = Math.max(length, 0);

            const startIndex = page * pageSize;
    
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
    
            return `${startIndex + 1} – ${endIndex} de ${length}`;
        };

        this.getLoggedInUser(this.token);
        this.getUsers();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

    }


    getLoggedInUser(token: string) {
        this._userService.getUserByOwner(token).subscribe({
            next: (resData) => {
                this.loggedInUserId = resData.user._id;
            },
            error: (err: HttpErrorResponse) => {
                this._snackbarService.showErrorMessage(err, "bottom", "red-snackbar", "Ha ocurrido un error al cargar los datos del usuario logueado");
            }
        });
    }


    getUsers() {
        this._userService.getUsers().subscribe({
            next: (resData) => {
                this.listUsers = resData.users;
                this.dataSource.data = this.listUsers;
            },
            error: (err) => {
                console.log(<any>err);
            }
        });
    }


    addUserDialog(userId?: string) {
        const dialogRef = this.dialog.open(AddUserComponent, {
            width: '600px',
            disableClose: true,
            data: { _id: userId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._snackbarService.snackbarMessage("Usuario creado exitosamente", "bottom", "green-snackbar");
                this.getUsers();
            }
        });
    }


    editUserDialog(userId: string, action: string) {
        const dialogRef = this.dialog.open(EditUserComponent, {
            width: '600px',
            disableClose: true,
            data: { _id: userId, action: action }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._snackbarService.snackbarMessage("Usuario actualizado exitosamente", "bottom", "green-snackbar");
                this.getUsers();
            }
        });
    }


    deleteUserDialog(userId: string, userName: string) {
        const dialogRef = this.dialog.open(DeleteUserComponent, {
            width: '600px',
            disableClose: false,
            data: { _id: userId, name: userName }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._snackbarService.snackbarMessage(`El usuario "${userName}" ha sido eliminado`, "bottom", "gray-snackbar");
                this.getUsers();
            }
        });
    }


    isCurrentUser(userId: string): boolean {
        return userId === this.loggedInUserId;
    }
}
