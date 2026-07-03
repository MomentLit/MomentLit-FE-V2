export type UserSearchResponse = {
  image_url: string;
  email: string;
  name: string;
  created_at: string;
  phone?: string | null;
  intro?: string | null;
  role?: string;
};
