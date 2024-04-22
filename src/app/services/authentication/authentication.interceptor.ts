import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {AuthenticationService} from "./authentication.service";
import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {backendUrl} from "../../constants";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {


  constructor(
    private readonly authenticationService: AuthenticationService
  ) {

  }


  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authenticationService.token
    const isBackendUrl = req.url.startsWith(backendUrl)
    if (token && isBackendUrl) {
      req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    }
    return next.handle(req).pipe(tap({
      error: error => {
        const isUnauthorized = error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized
        if (isUnauthorized && token && isBackendUrl) {
          this.authenticationService.logOut()
        }
      }
    }))
  }
}
