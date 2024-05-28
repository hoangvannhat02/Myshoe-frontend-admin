import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/myservice/auth-service.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthServiceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      // Thêm access token vào header của mỗi yêu cầu
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.error === 'TokenExpired') {
          // Xử lý khi token hết hiệu lực
          return this.handleTokenExpired(request, next);
        }
        // Xử lý các lỗi khác nếu cần
        return throwError(error);
      })
    );
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Tái tạo token và thử lại yêu cầu gốc
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Nếu tái tạo thành công, thêm access token mới vào yêu cầu và thử lại yêu cầu gốc
        const newAccessToken = this.authService.getAccessToken();
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newAccessToken}`
          }
        });
        return next.handle(request);
      }),
      catchError((refreshError) => {
        // Xử lý lỗi tái tạo token
        console.error('Refresh token error:', refreshError);
        // Đưa người dùng về trang đăng nhập hoặc xử lý lỗi khác nếu cần
        return throwError(refreshError);
      })
    );
  }
}
