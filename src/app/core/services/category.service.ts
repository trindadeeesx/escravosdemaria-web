import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

@Injectable({ providedIn: "root" })
export class CategoryService {
	constructor(private api: ApiService) {}

	getByType(type: "BLOG" | "FORUM"): Observable<Category[]> {
		return this.api.get<Category[]>(`/categories/type/${type}`);
	}
}
