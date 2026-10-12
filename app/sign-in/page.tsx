import { ApiForm } from "@/components/forms/ApiForm";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Sign in", description: "Sign in to ZibaHub.", path: "/sign-in" });
export default function SignInPage() {
  return (
    <div className="shell page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Sign in</h1>
      <ApiForm action="/api/auth/login" submitLabel="Sign in">
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" required /></label>
      </ApiForm>
      <p><Link href="/forgot-password">Forgot password</Link> · <Link href="/sign-up">Create account</Link></p>
    </div>
  );
}
