import { Suspense } from "react";

import GoogleOAuthCallbackScreen from "@/features/auth/components/GoogleOAuthCallbackScreen";

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleOAuthCallbackScreen />
    </Suspense>
  );
}
