import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompositionsService {
    constructor(private http: HttpClient) { }
    getCompByProject(projectid) {
        return this.http.get(environment.apiUrl + '/compositions?project=' + projectid);
    }
    create(name, tholdmin, tholdmax, project) {
        return this.http.post(environment.apiUrl + '/compositions', {name: name, tholdmin: tholdmin, tholdmax: tholdmax, projectid: project})
    }
    delete(id){
        return this.http.delete(environment.apiUrl + '/compositions?id='+id)
    }
}