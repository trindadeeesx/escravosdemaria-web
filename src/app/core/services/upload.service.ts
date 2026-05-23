import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface UploadResponse {
  url: string;
}

@Injectable({ providedIn: "root" })
export class UploadService {
	constructor(private http: HttpClient) {}

	upload(file: File): Observable<UploadResponse> {
		const form = new FormData();
		form.append("file", file);
		return this.http.post<UploadResponse>(`${environment.apiUrl}/upload`, form);
	}
}
