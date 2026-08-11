import { redirect } from "next/navigation";
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-xl">KEB</span>
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-foreground/60 text-sm mt-2">Masuk ke Dashboard CSR Kawasan Ekonomi Berkelanjutan</p>
        </div>

        <LoginForm />
        
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-foreground/40">
          <p>Demo Akun:</p>
          <p>pusat@csr.com / password123</p>
          <p>pertanian@csr.com / password123</p>
        </div>
      </div>
    </div>
  );
}
