import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupplierService {
    constructor(private http: HttpClient) { }
    create(newName: String, projectId: String) {
        return this.http.post(environment.apiUrl + '/suppliers', { name: newName, projectid: projectId })
    }
    getAll(projectId) {
        return this.http.get(environment.apiUrl + '/suppliers?project=' + projectId)
    }
    delete(eqId: String) {
        return this.http.delete(environment.apiUrl + '/suppliers?id=' + eqId)
    }
}