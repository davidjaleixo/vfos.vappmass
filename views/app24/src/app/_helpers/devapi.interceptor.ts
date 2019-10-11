import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isDevMode } from '@angular/core';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // change the req destination for test cases
        if(isDevMode()){
            console.log("updating api url");
            let req_clone = request.clone({url: 'http://localhost:4201/' + request.url})
            return next.handle(req_clone)
        }else{
            return next.handle(request)
        }
    }
}