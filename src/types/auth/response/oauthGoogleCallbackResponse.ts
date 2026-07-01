export type OAuthGoogleCallbackResponse = {
  name: string;
  role: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};
