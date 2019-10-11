import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    constructor(private http: HttpClient) { }

    getNotifications() {
        return this.http.get(environment.apiUrl + '/notifications');
    }
    markasread(id) {
        return this.http.patch(environment.apiUrl + '/notifications?id=' + id, { read: true });
    }
    markasunread(id) {
        return this.http.patch(environment.apiUrl + '/notifications?id=' + id, { read: false });
    }
    sendNotification(predictionResult){
        return this.http.post(environment.apiUrl + '/notifications', predictionResult)
    }
    delete(id){
        return this.http.delete(environment.apiUrl + '/notifications?id=' + id);
    }

}