export interface Experience {
    id?: string;
    company: string;
    company_ar?: string;
    role: string;
    role_ar?: string;
    location: string;
    location_ar?: string;
    date: string;
    description: string; // Markdown content
    description_ar?: string; // Arabic markdown content
    order?: number; // Display order (lower numbers appear first)
    createdAt?: string;
}

export interface JourneyPhase {
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
}

export interface Project {
    id?: string;
    title: string;
    title_ar?: string;
    shortDescription: string;
    shortDescription_ar?: string;
    longDescription?: string;
    longDescription_ar?: string;
    features?: string; // Markdown content
    features_ar?: string;
    challenge?: string;
    challenge_ar?: string;
    results?: string;
    results_ar?: string;
    impact?: string; // Quantifiable impact
    impact_ar?: string;
    journey?: JourneyPhase[]; // Step-by-step story
    techStack: string[];
    projectLink: string;
    images: string[];
    logo?: string;
    homeImage?: string;
    thumbnail?: string; // Movie-card thumbnail image
    color?: string; // Custom theme color (e.g., #7628E5)
    categories?: string[]; // Multiple categories for filtering (Mobile, Web, UI/UX, AI, etc.)
    createdAt?: string;
}

export interface Profile {
    id?: string;
    name: string;
    name_ar?: string;
    role: string;
    role_ar?: string;
    email: string;
    phone?: string;
    location?: string;
    location_ar?: string;
    aboutMe: string;
    aboutMe_ar?: string;
    catchyPhrase: string;
    catchyPhrase_ar?: string;
    cvLink: string;
    profilePic?: string;
    githubContributions?: string;
    experienceYears?: string;
    projectsDone?: string;
}

export interface User {
    uid: string;
    email: string | null;
}

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt?: string;
    status: "new" | "read" | "replied";
}
