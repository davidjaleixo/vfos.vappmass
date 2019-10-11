import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    constructor(private http: HttpClient) { }
    create(projectName: String, projectDescription: String) {
        return this.http.post(environment.apiUrl + '/projects', { name: projectName, description: projectDescription })
    }
    getAll() {
        return this.http.get(environment.apiUrl + '/projects')
    }
    getProject(projectId: String) {
        return this.http.get(environment.apiUrl + '/projects?id=' + projectId)
    }
    updateName(projectId: String, newName: String) {
        return this.http.patch(environment.apiUrl + '/projects?id=' + projectId, {name: newName})
    }
    updateDescription(projectId: String, newDescription: String){
        return this.http.patch(environment.apiUrl + '/projects?id=' + projectId, {description: newDescription})
    }
    updateThreshold(projectId: String, newThold: String){
        return this.http.patch(environment.apiUrl + '/projects?id=' + projectId, {threshold: newThold})
    }
    updateStatus(projectId: String, newStatus: Boolean){
        return this.http.patch(environment.apiUrl + '/projects?id='+projectId, {status: newStatus})
    }
    delete(projectId: String){
        return this.http.delete(environment.apiUrl + '/projects?id='+projectId)
    }
}