import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post(environment.apiUrl + `/login`, { username: email, password: password })
            .pipe(map(response => {
                //console.log("this is the answer: " + JSON.stringify(response['token']));
                let token = response['token'];
                // login successful if there's a jwt token in the response
                if (token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token', JSON.stringify(token));
                }

                return token;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
    }

    register(name: string, password: string, type: number){
        return this.http.post(environment.apiUrl + '/register', { username: name, password: password, type: type})
        .pipe(map(response => {
            let token = response['token'];
            // if(token){
            //     localStorage.setItem('token', JSON.stringify(token));
            // }
            return token;
        }))
    }

    getTokenExpirationDate(token: string): Date {
        const decoded = jwt_decode(token);

        if (decoded.exp === undefined) return null;

        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);
        return date;
      }
    isTokenExpired(token?: string): boolean {
        if(!token) token = localStorage.getItem('token');
        if(!token) return true;

        const date = this.getTokenExpirationDate(token);
        if(date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
      }
    getUserDetails(token?: string): any {
        if(!token) token = localStorage.getItem('token');
        try {
            const decoded = jwt_decode(token);
            return { id: decoded.id, username: decoded.username, role: decoded.role}
        } catch (error) {
            return null;
        }
        
    }

    getAccId(token?: string):any{
        if(!token) token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        return decoded._id;
    }

    isLoggedIn():boolean{
        let user = this.getUserDetails();
        if(user){
            return user.exp > Date.now() / 1000; //return true if the session is not expired
        }else{
            return false;
        }
    }

    
}