import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService, Page } from "./api";

export interface PendingPost {
  id: string;
  title: string;
  content: string;
  type: "BLOG" | "FORUM" | "QUESTION";
  status: string;
  author: { username: string; avatar?: string };
  createdAt: string;
}

@Injectable({ providedIn: "root" })
export class ModerationService {
  constructor(private api: ApiService) {}

  getPending(page = 0): Observable<Page<PendingPost>> {
    return this.api.get<Page<PendingPost>>("/moderation/pending", { page });
  }

  approve(id: string): Observable<any> {
    return this.api.post(`/moderation/approve/${id}`, {});
  }
  reject(id: string): Observable<any> {
    return this.api.post(`/moderation/reject/${id}`, {});
  }
  close(id: string): Observable<any> {
    return this.api.post(`/moderation/close/${id}`, {});
  }
}
