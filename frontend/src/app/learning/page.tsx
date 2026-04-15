import { redirect } from "next/navigation";

/** Redirect to first module by default. */
export default function LearningIndexPage() {
  redirect("/learning/dashboard");
}
