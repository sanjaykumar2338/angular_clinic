import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpClient,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
 
  url: any;
  requestedToken:any;

  constructor(
    public http: HttpClient,
    private notificationService: NotificationService
  ) { }
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const getToken: string | any = localStorage.getItem("token");
    let token = getToken;
    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log(event)
        }
        return event;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
