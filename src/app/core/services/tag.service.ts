import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

@Injectable({ providedIn: "root" })
export class TagService {
	constructor(private api: ApiService) {}

	getAll(): Observable<Tag[]> {
		return this.api.get<Tag[]>("/tags");
	}
}
