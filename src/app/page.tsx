import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "./GoogleSignInButton";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  debugger
  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded) {
        // Redirect to the dashboard if the token is valid
        redirect("/home");
      }
    } catch (error) {
      // If token verification fails, do nothing and continue to render the page
      console.error("Token verification failed:", error);
      redirect("/"); // or render a login message instead
    }
  }
  

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-[32px] row-start-2 items-center  bg-[url(/bg-login.png)] bg-cover bg-center bg-no-repeat p-8 sm:p-16 rounded-lg shadow-lg z-10">
        <div className="flex flex-col gap-[8px] justify-center items-center">
          <div className="relative flex items-center justify-center gap-2 flex-row">
            <Image
              src="/receipt-ledger.png"
              alt="ReceiptLedger Logo"
              className="float-left"
              width={100}
              height={50}
            />
            <div>
              <h1 className="text-2xl">
                <strong >From Receipts to Reconciliation-</strong>
              </h1>
              <h1 className="text-2xl"> All in One Place.</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <GoogleSignInButton />
        </div>
        <div className="gap-[16px]">
          <p className="text-sm text-gray-500 mb-3 " style={{
            backgroundImage: 'linear-gradient(90deg, hsla(0,0%,100%,0.5), hsla(0,0%,100%,0))',
          }}>
            🔄 Automated Receipt Parsing -  No manual entry ever.
          </p>
          <p className="text-sm text-gray-500 mb-3" style={{
            backgroundImage: 'linear-gradient(90deg, hsla(0,0%,100%,0.5), hsla(0,0%,100%,0))',
          }}>
            📂 Unified Ledger View - All transactions, one dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-3" style={{
            backgroundImage: 'linear-gradient(90deg, hsla(0,0%,100%,0.5), hsla(0,0%,100%,0))',
          }}>
            ✅ Effortless Reconciliation - Instantly detect mismatches.
          </p>.
        </div>
      </main>
    </div>
  );
}
