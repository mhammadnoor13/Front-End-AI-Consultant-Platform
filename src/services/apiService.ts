import { LoginRequest, RegisterRequest, User } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5100';

export interface AuthResponse {
  token: string;
  //user: User ;
}

/**
 * Logs in a user with given credentials.
 * @param credentials { email, password }
 * @returns { token, user }
 * @throws Error if the HTTP response is not ok
 */
export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Login failed with status ${response.status}`);
  }

  const data = (await response.json()) as AuthResponse;
  return data;
}

/**
 * Registers a new user.
 * @param userData { firstName, lastName, email, password, ... }
 * @returns { token, user }
 * @throws Error if the HTTP response is not ok
 */
export async function register(
  userData: RegisterRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Registration failed with status ${response.status}`);
  }

  const data = (await response.json()) as AuthResponse;
  return data;
}

/**
 * Fetches the current user's profile by verifying a JWT.
 * @param token JWT string
 * @returns User object
 * @throws Error if the HTTP response is not ok
 */
export async function getUserProfile(
  token: string
): Promise<User> {
  const response = await fetch(`${API_BASE}/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile (status: ${response.status})`);
  }

  const user = (await response.json()) as User;
  return user;
}

/**
 * A single object to import throughout the app.
 */
const apiService = {
  login,
  register,
  getUserProfile,
};

export default apiService;
