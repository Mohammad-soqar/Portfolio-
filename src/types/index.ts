export interface Experience {
    id?: string;
    company: string;
    role: string;
    location: string;
    date: string;
    description: string; // Markdown content
    createdAt?: string;
}

export interface JourneyPhase {
    title: string;
    description: string;
}

export interface Project {
    id?: string;
    title: string;
    shortDescription: string;
    longDescription?: string;
    features?: string; // Markdown content
    challenge?: string;
    results?: string;
    impact?: string; // Quantifiable impact
    journey?: JourneyPhase[]; // Step-by-step story
    techStack: string[];
    projectLink: string;
    images: string[];
    logo?: string;
    homeImage?: string;
    thumbnail?: string; // Movie-card thumbnail image
    category?: string;
    createdAt?: string;
}

export interface Profile {
    id?: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    location?: string;
    aboutMe: string;
    catchyPhrase: string;
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
