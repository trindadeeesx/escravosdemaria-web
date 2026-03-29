import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Api, Page } from "./api";
import { Author } from "./blog";

export interface Question {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  status: string;
  author: Author;
  createdAt: string;
  answerCount?: number;
  isClosed?: boolean;
}

export interface CreateQuestion {
  title: string;
  content: string;
  tagSlugs?: string[];
  categorySlug?: string;
}

@Injectable({ providedIn: "root" })
export class Questions {
  constructor(private api: Api) {}

  getAll(page = 0, size = 20): Observable<Page<Question>> {
    return this.api.get<Page<Question>>("/questions", { page, size });
  }

  create(q: CreateQuestion): Observable<Question> {
    return this.api.post<Question>("/questions", q);
  }
}
