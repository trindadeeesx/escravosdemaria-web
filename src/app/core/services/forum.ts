import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService, Page } from "./api";
import { Author } from "./blog";

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  status: string;
  author: Author;
  createdAt: string;
  replyCount?: number;
}

export interface CreateForumPost {
  title: string;
  content: string;
  tagSlugs?: string[];
  categorySlug?: string;
}

@Injectable({ providedIn: "root" })
export class ForumService {
  constructor(private api: ApiService) {}

  getAll(page = 0, size = 20): Observable<Page<ForumPost>> {
    return this.api.get<Page<ForumPost>>("/forum", { page, size });
  }

  create(post: CreateForumPost): Observable<ForumPost> {
    return this.api.post<ForumPost>("/forum", post);
  }
}
