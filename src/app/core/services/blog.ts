import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Api, Page } from "./api";

export interface Author {
  username: string;
  avatar: string;
  displayColor: string;
  gender?: string;
  religion?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  tags?: string[];
  categorySlug?: string;
  status: string;
  author: Author;
  createdAt: string;
  publishToDiscord?: boolean;
  publishToInstagram?: boolean;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  tagSlugs?: string[];
  categorySlug?: string;
  publishToSite: boolean;
  publishToDiscord: boolean;
  publishToInstagram: boolean;
}

@Injectable({ providedIn: "root" })
export class Blog {
  constructor(private api: Api) {}

  getAll(page = 0, size = 10): Observable<Page<BlogPost>> {
    return this.api.get<Page<BlogPost>>("/blog", { page, size });
  }

  create(post: CreateBlogPost): Observable<BlogPost> {
    return this.api.post<BlogPost>("/blog", post);
  }
}
