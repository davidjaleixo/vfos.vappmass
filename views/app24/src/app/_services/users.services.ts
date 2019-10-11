import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getOnProject(projectid) {
        return this.http.get(environment.apiUrl + '/users?projectid='+projectid)
    }
    getOutProject(projectid){
        return this.http.get(environment.apiUrl + '/users?outprojectid='+projectid)
    }
    allocate(accountid, projectid){
        return this.http.post(environment.apiUrl + '/users', {accountid: accountid, projectid: projectid})
    }
    unAllocate(allocationId){
        return this.http.delete(environment.apiUrl + '/users?id=' + allocationId)
    }
}