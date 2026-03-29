import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService, Page } from "./api";

export interface Author {
  username: string;
  avatar?: string;
  displayColor?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  upvotes: number;
  tags?: string[];
  status: string;
  author: Author;
  createdAt: string;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  coverImageUrl?: string;
  tagSlugs?: string[];
  categorySlug?: string;
  publishToSite: boolean;
  publishToDiscord: boolean;
  publishToInstagram: boolean;
}

const MOCK: BlogPost[] = [
  {
    id: "1",
    title: "Ladainha das Santas Chagas",
    content:
      "Ladainha dedicada às Santas Chagas de Cristo e de Maria, para ser rezada em devoção particular ou em comunidade, especialmente às sextas-feiras e durante o tempo da Quaresma. Esta devoção remonta aos primeiros séculos da Igreja e foi retomada pelos grandes santos medievais.",
    tags: ["liturgia", "oracao"],
    status: "PUBLISHED",
    author: { username: "Pe. João", avatar: "" },
    createdAt: "2026-02-18T10:00:00Z",
    upvotes: 42,
  },
  {
    id: "2",
    title: "Das Penitências para a Quaresma",
    content:
      "Reflexões sobre a prática da penitência durante o tempo quaresmal, com orientações espirituais para o jejum e a abstinência segundo a tradição da Igreja e os ensinamentos dos Santos Padres.",
    status: "PUBLISHED",
    tags: ["quaresma", "penitencia", "oracao"],
    author: { username: "Trindade", avatar: "" },
    createdAt: "2026-02-16T08:30:00Z",
    upvotes: 18,
  },
  {
    id: "3",
    title: "Ladainha do Espírito Santo",
    content:
      "Invocações e louvores ao Espírito Santo, o Consolador prometido por Cristo aos apóstolos, presente na Igreja desde o dia de Pentecostes e guia de toda a vida cristã.",
    tags: ["espirito-santo", "oracao"],
    status: "PUBLISHED",
    author: { username: "Maria Clara", avatar: "" },
    createdAt: "2026-02-15T14:00:00Z",
    upvotes: 31,
  },
  {
    id: "4",
    title: "A Doutrina Social da Igreja",
    content:
      "Um panorama da Doutrina Social da Igreja desde a Rerum Novarum até os nossos dias, compreendendo os princípios fundamentais de solidariedade, subsidiariedade e bem comum.",
    status: "PUBLISHED",
    tags: ["doutrina", "igreja", "tradicao"],
    author: { username: "Pe. João", avatar: "" },
    createdAt: "2026-02-10T09:00:00Z",
    upvotes: 27,
  },
];

@Injectable({ providedIn: "root" })
export class BlogService {
  constructor(private api: ApiService) {}

  getAll(page = 0, size = 10): Observable<Page<BlogPost>> {
    // trocar por this.api.get('/blog', { page, size }) quando backend estiver pronto
    return of({ content: MOCK, totalPages: 1, totalElements: MOCK.length, number: 0 });
  }

  create(post: CreateBlogPost): Observable<BlogPost> {
    return this.api.post<BlogPost>("/blog", post);
  }
}
