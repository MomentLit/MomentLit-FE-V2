export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  name: string;
  role: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
};

export type SignOutRequest = {
  refresh_token: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type OAuthGoogleCallbackResponse = {
  name: string;
  role: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};
