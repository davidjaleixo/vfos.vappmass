import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SlumpService {
    constructor(private http: HttpClient) { }
    
    registerTest(value, compositionId, projectId, supplierId, loadId){
        return this.http.post(environment.apiUrl + '/slumptest', {value: value, composition: compositionId, project: projectId, supplier: supplierId, loadid: loadId})
    }
    getTests(projectId){
        return this.http.get(environment.apiUrl + '/slumptest?project='+projectId);
    }
    createPrediction(value, compositionId, projectId, supplierId, loadId):Observable<any>{
        return this.http.post(environment.apiUrl + '/prediction', {value: value, composition: compositionId, project: projectId, supplier: supplierId, loadid: loadId})
    }
    delete(id){
        return this.http.delete(environment.apiUrl + '/slumptest?id='+id)
    }
}