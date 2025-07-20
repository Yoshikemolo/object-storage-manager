import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Don't add auth header to ping endpoint
  if (req.url.includes('/storage/ping')) {
    return next(req);
  }

  // Add auth header to all other storage API requests
  if (req.url.includes('/storage')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.authToken}`
      }
    });
    return next(authReq);
  }

  return next(req);
};