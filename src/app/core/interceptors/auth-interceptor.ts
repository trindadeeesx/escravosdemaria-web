import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Interceptor rodando");

  const token = localStorage.getItem("token");

  if (token) {
    console.log("Token encontrado");

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
