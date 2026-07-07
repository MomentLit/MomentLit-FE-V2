import type { OAuthGoogleCallbackResponse } from "./oauthGoogleCallbackResponse";

export type OAuthGoogleCallbackResult =
  | {
      data: OAuthGoogleCallbackResponse;
      error?: never;
    }
  | {
      data?: never;
      error: string;
    };
