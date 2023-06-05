import {GrammarResponse, PlagResponse} from "./plag.model";

export interface SopDocUploadResponse {
    docId: number;
    document: string;
    letters: number;
    stage: number;
    sentenses: number;
    words: number
    positive: any[];
    negative: string[];
    Plagiarism: PlagResponse;
    grammer: GrammarResponse;
}

export interface PlagCheckResponse {
    Plagiarism: PlagResponse;
    grammer: GrammarResponse;
}

export interface Country {
    positive: any[];
    negative: string[];
}

export interface University {
    positive: string[];
    negative: string[];
}

export interface Course {
    positive: string[];
    negative: string[];
}

export interface VerifyResponse {
    country: Country;
    university: University;
    course: Course;
}

export interface VerifyPlagPayload {
    docId: number;
    data: string;
}