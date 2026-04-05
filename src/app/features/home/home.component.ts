import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PostCardComponent } from "../shared/components/post-card/post-card.component";

import { HomeService } from "./home.service";
import { CarouselSlide } from "../../core/models/carousel.model";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterLink, CommonModule, PostCardComponent],
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
	carouselSlides: CarouselSlide[] = [];
	activeSlide = 0;
	private autoplayInterval: ReturnType<typeof setInterval> | null = null;
	private readonly AUTOPLAY_DELAY = 5000;

	constructor(public homeService: HomeService) {}

	ngOnInit(): void {
		this.homeService.loadHome();
		this.loadCarousel();
	}

	ngOnDestroy(): void {
		this.stopAutoplay();
	}

	// ==================== GETTERS ====================
	get todayFormatted(): string {
		return new Intl.DateTimeFormat("pt-BR", {
			weekday: "long",
			day: "numeric",
			month: "long",
		}).format(new Date());
	}

	get homeData() {
		return this.homeService.homeData();
	}

	get loading() {
		return this.homeService.loading();
	}

	get error() {
		return this.homeService.error();
	}

	// Computados úteis
	get featuredPost() {
		return this.homeData?.recentBlogPosts?.[0] ?? null;
	}

	get secondaryPosts() {
		return this.homeData?.recentBlogPosts?.slice(1, 5) ?? [];
	}

	get trendingForum() {
		return this.homeData?.trendingForumPosts ?? [];
	}

	get lastAnsweredQuestion() {
		return this.homeData?.lastAnsweredQuestion ?? null;
	}

	get lastPopes() {
		return this.homeData?.lastPopes ?? [];
	}

	// ==================== CARROSSEL ====================
	private loadCarousel(): void {
		this.carouselSlides = [
			{ id: "1", imageUrl: null, alt: "Escravos de Maria", order: 0, active: true },
			{ id: "2", imageUrl: null, alt: "Nossa Senhora", order: 1, active: true },
			{ id: "3", imageUrl: null, alt: "Liturgia", order: 2, active: true },
		]
			.filter((s) => s.active)
			.sort((a, b) => a.order! - b.order!);

		if (this.carouselSlides.length > 1) this.startAutoplay();
	}

	nextSlide() {
		this.activeSlide = (this.activeSlide + 1) % this.carouselSlides.length;
		this.resetAutoplay();
	}

	prevSlide() {
		this.activeSlide =
			(this.activeSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
		this.resetAutoplay();
	}

	goToSlide(index: number) {
		this.activeSlide = index;
		this.resetAutoplay();
	}

	private startAutoplay() {
		this.autoplayInterval = setInterval(() => this.nextSlide(), this.AUTOPLAY_DELAY);
	}

	private stopAutoplay() {
		if (this.autoplayInterval) clearInterval(this.autoplayInterval);
	}

	private resetAutoplay() {
		this.stopAutoplay();
		if (this.carouselSlides.length > 1) this.startAutoplay();
	}

	// ==================== HELPERS ====================
	formatDate(iso: string): string {
		return new Intl.DateTimeFormat("pt-BR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}).format(new Date(iso));
	}

	readTime(content: string): number {
		const words = content.trim().split(/\s+/).length;
		return Math.max(1, Math.round(words / 200));
	}

	excerpt(content: string, limit = 160): string {
		return content.length > limit ? content.slice(0, limit).trimEnd() + "…" : content;
	}
}
