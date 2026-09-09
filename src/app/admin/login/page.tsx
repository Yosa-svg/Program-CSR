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
          <div className="bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 px-6 py-3.5 shadow-sm border border-border w-fit">
            <Image
              src="/images/antam-logo.png"
              alt="Logo ANTAM"
              width={160}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">Portal Login</h1>
          <p className="text-foreground/60 text-sm mt-2">
            CSR ANTAM — Kawasan Ekonomi Keberlanjutan
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
