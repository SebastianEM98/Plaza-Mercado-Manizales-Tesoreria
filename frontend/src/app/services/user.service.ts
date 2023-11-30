import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private myAppUrl: string;
    private myApiUrl: string;

    private userRole: string = ''; 
    private userRoleSubject = new Subject<string>();
    userRole$ = this.userRoleSubject.asObservable();

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'api/';
    }


    setUserRole(role: string) {
        this.userRoleSubject.next(role);
        this.userRole = role;
    }
    
    getUserRole(): string {
        return this.userRole;
    }


    login(user: any): Observable<string> {
        return this.http.post<string>(this.myAppUrl + this.myApiUrl + 'login', user);
    }


    createUsers(user: User): Observable<any> {
        return this.http.post(this.myAppUrl + this.myApiUrl + 'create-user', user);
    }


    getUsers(): Observable<any> {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'users');
    }


    getUser(id: string): Observable<any> {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'user/' + id);
    }


    getUserByOwner(token: string): Observable<any> {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'user-owner/' + token);
    }


    updateUserByOwner(id: string, user: User): Observable<string> {
        return this.http.put<string>(this.myAppUrl + this.myApiUrl + 'user-owner/' + id, user);
    }


    updateUser(id: string, user: User): Observable<any> {
        return this.http.put(this.myAppUrl + this.myApiUrl + 'user/' + id, user);
    }


    changeUserPassword(id: string, user: any): Observable<any> {
        return this.http.put(this.myAppUrl + this.myApiUrl + 'user-password/' + id, user);
    }


    deleteUser(id: string): Observable<any> {
        return this.http.delete(this.myAppUrl + this.myApiUrl + 'user/' + id);
    }
}
