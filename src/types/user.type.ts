export type SignUpRequest = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type SignUpResponse = {
  user_id: string;
};

export type UserSearchResponse = {
  image_url: string;
  email: string;
  name: string;
  created_at: string;
};

export type UserUpdateRequest = {
  name?: string | null;
  image_url?: string | null;
  phone?: string | null;
  intro?: string | null;
};

export type UserAuthResponse = {
  userId: string;
  name: string;
  role: string;
};
