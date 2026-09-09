import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 admin-theme">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8 text-foreground">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl border border-border/40 shadow-sm flex items-center justify-center mx-auto mb-4 p-2">
            <Image
              src="/images/logo-antam.webp"
              alt="Logo ANTAM"
              width={72}
              height={72}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Portal Login</h1>
          <p className="text-foreground/60 text-sm mt-2">
            CSR ANTAM — Kawasan Ekonomi Berkelanjutan
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
