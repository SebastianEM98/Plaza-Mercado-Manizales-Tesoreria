import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Renter } from '../interfaces/renter';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RenterService {
    private myAppUrl: string;
    private myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = 'api/';
    }

    createRenter(renter: any): Observable<any> {
        return this.http.post(this.myAppUrl + this.myApiUrl + 'create-renter', renter);
    }


    getRenters(): Observable<any> {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'renters');
    }

    
    getRenter(id: string): Observable<any> {
        return this.http.get(this.myAppUrl + this.myApiUrl + 'renter/' + id);
    }


    updateRenter(id: string, renter: any): Observable<any> {
        return this.http.put(this.myAppUrl + this.myApiUrl + 'renter/' + id, renter);
    }


    deleteRenter(id: string): Observable<any> {
        return this.http.delete(this.myAppUrl + this.myApiUrl + 'renter/' + id);
    }
}
