import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService, Page } from "./api.service";
import { BlogPost } from "../models";

export interface CreateBlogPost {
  title: string;
  content: string;
  coverImageUrl?: string | null;
  imageUrls?: string[];
  categorySlug: string;
  tagSlugs?: string[];
  publishToSite?: boolean;
  publishToDiscord?: boolean;
  publishToInstagram?: boolean;
}

@Injectable({ providedIn: "root" })
export class BlogService {
	constructor(private api: ApiService) {}

	getAll(page = 0, size = 10): Observable<Page<BlogPost>> {
		return this.api.get<Page<BlogPost>>("/blog", { page, size });
	}

	create(post: CreateBlogPost): Observable<BlogPost> {
		return this.api.post<BlogPost>("/blog", post);
	}

	vote(postId: string, type: "UPVOTE" | "DOWNVOTE"): Observable<{ upvotes: number; downvotes: number; userVote: string | null }> {
		return this.api.post(`/blog/${postId}/vote`, null, { type });
	}
}
