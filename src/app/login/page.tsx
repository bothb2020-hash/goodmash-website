import type { Metadata } from "next";
import { Container, Section } from "@/components/Section";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your GoodMash account. Authentication is handled securely by the GoodMash backend.",
};

export default function Login() {
  return (
    <>
      <Section className="bg-brand-950 text-white">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-3 text-sm text-brand-100/80">
                Login to your GoodMash account to manage your groups,
                connections and maintenance.
              </p>
            </div>
            <div className="mt-8">
              <LoginForm />
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-brand-200/60">
              Authentication is handled securely by the GoodMash backend. The
              website never stores passwords. Account login for the mobile app
              will be fully connected when the application is published.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
