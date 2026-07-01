import AuthPageShell from "@/features/auth/components/AuthPageShell";
import SignupForm from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthPageShell page="signup">
      <SignupForm />
    </AuthPageShell>
  );
}
