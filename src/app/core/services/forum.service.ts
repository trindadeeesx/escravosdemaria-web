import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService, Page } from "./api.service";
import { Author } from "../models";

export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  type: string;
  coverImageUrl?: string | null;
  imageUrls: string[];
  tags?: string[];
  status: string;
  author: Author;
  category?: { id: string; name: string; slug: string };
  createdAt: string;
  replyCount?: number;
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
}

export interface ForumFilters {
  q?: string;
  tag?: string;
  author?: string;
  sort?: "hot" | "new" | "top";
}

export interface CreateForumPost {
  title: string;
  content: string;
  coverImageUrl?: string | null;
  imageUrls?: string[];
  categorySlug?: string;
  tagSlugs?: string[];
  isDraft?: boolean;
}

export interface VoteResponse {
  upvotes: number;
  downvotes: number;
  userVote: VoteType | null;
}

@Injectable({ providedIn: "root" })
export class ForumService {
	constructor(private api: ApiService) {}

	getAll(page = 0, size = 20, filters: ForumFilters = {}): Observable<Page<ForumPost>> {
		const params: Record<string, any> = { page, size };
		if (filters.q)      params["q"]      = filters.q;
		if (filters.tag)    params["tag"]     = filters.tag;
		if (filters.author) params["author"]  = filters.author;
		if (filters.sort)   params["sort"]    = filters.sort;
		return this.api.get<Page<ForumPost>>("/forum", params);
	}

	create(post: CreateForumPost): Observable<ForumPost> {
		return this.api.post<ForumPost>("/forum", post);
	}

	saveDraft(post: CreateForumPost): Observable<ForumPost> {
		return this.api.post<ForumPost>("/forum", { ...post, isDraft: true });
	}

	vote(postId: string, type: VoteType): Observable<VoteResponse> {
		return this.api.post<VoteResponse>(`/forum/${postId}/vote`, null, { type });
	}

	getById(id: string): Observable<ForumPost> {
		return this.api.get<ForumPost>(`/forum/${id}`);
	}
}
