import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

@Injectable({ providedIn: "root" })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    let p = new HttpParams();
    if (params) Object.entries(params).forEach(([k, v]) => (p = p.set(k, String(v))));
    return this.http
      .get<T>(`${this.base}${path}`, { params: p })
      .pipe(catchError((e) => throwError(() => e)));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.base}${path}`, body)
      .pipe(catchError((e) => throwError(() => e)));
  }
}
