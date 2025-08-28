import { redirect } from "next/navigation";

export default function SignInPage() {
  // Redirect to new auth login page
  redirect("/auth/login");
}
