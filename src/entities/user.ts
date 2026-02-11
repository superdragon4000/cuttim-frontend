export type UserRole = 'client' | 'manager';

export type UserProfile = {
  id: number;
  email: string;
  phone?: string | null;
  role: UserRole;
  name?: string | null;
};

export type LoginResponse = {
  access_token: string;
  user: UserProfile;
};
