import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountsService {
    constructor(private http: HttpClient) { }
    getAvailableUsers(NotThisId){
        return this.http.get(environment.apiUrl + '/accounts?filterid='+NotThisId);
    }
}