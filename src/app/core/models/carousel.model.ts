export interface CarouselSlide {
	id: string;
	imageUrl: string | null;
	alt: string;
	title?: string;
	linkUrl?: string;
	order: number;
	active: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateCarouselSlide {
	imageUrl: string | null;
	alt: string;
	title?: string;
	linkUrl?: string;
	order?: number;
}
