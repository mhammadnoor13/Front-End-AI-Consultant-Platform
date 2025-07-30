// Common types for the application

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  speciality: string;
  role: 'consultant' | 'admin';
  doctorId?: string;
  verified: boolean;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'New' | 'Assigned' | 'ReadyToReview' | 'Completed';
  createdAt: string;
  email: string;
  speciality: string;
}

export interface CaseToReviewResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface CaseDetail extends CaseToReviewResponse {
  suggestions: Suggestion[];
}

export interface PendingConsultant {
  id: string;
  firstName: string;
  lastName: string;
  doctorId: string;
  email: string;
  speciality: string;
}

export interface SubmitCaseRequest {
  email: string;
  title: string;
  description: string;
  speciality: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  speciality: string;
  //doctorId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ReviewSubmissionRequest {
  caseId: string;
  solution: string;
}

// Specialities enum
export const SPECIALITIES = [
  'طبي'
] as const;

export type Speciality = typeof SPECIALITIES[number];