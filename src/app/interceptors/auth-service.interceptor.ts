import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthServiceInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const registsredUrls : string[] = [
      'api/User/testSubmit',
      'api/User/userEmailAndId',
      'api/Question',
      'api/SqlQuestion',
      'api/Admin',
      'api/Email'
    ];
    let setToken : boolean = false;
    for (let index = 0; index < registsredUrls.length; index++) {
      const element = registsredUrls[index];
      if (request.url.includes(element)) {
        setToken = true;
        break;
      }
    }
    if (setToken) {
      // add the bearer token to the headers
      // get the bearer token
      const token = sessionStorage.getItem('token');
      if (token == null) {
        return next.handle(request);
      }
      const newRequestObj = request.clone({
        headers:request.headers.append('Authorization',`Bearer ${token}`)
      });
      
      return next.handle(newRequestObj);
    }

    else{
      return next.handle(request);
    }

  }
}
