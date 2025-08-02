"use client";

import Image from "next/image";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { callAfterLoginAPI } from "./lib/api/postLoginService";
import { useEffect } from "react";

export default function GoogleSignInButton() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            const session = await getSession();
            if (session?.accessToken) {
                // Stop polling
                console.log("Session found, stopping interval");
                clearInterval(interval);
                // Now call your backend
                const res = await callAfterLoginAPI({
                    name: session.user?.name,
                    email: session.user?.email,
                    accessToken: session.accessToken as string,
                    refreshToken: session.refreshToken as string,
                });

                if (res.token) {
                    Cookies.set("auth_token", res.token, { expires: 7 });
                    router.push(res.isNewUser ? "/onboarding" : "/home");
                } else {
                    console.error("No token from backend");
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleGoogleLogin = async () => {
        const result = await signIn("google", { redirect: false, callbackUrl: "/", }).catch((error) => {
            console.error("Google sign-in error:", error);
            return null;
        });
        console.log("Google sign-in result:", result);
        if (result?.ok) {
            setTimeout(async () => {
                const session = await getSession();
                if (!session) return;

                const res = await callAfterLoginAPI({
                    name: session.user?.name,
                    email: session.user?.email,
                    accessToken: session.accessToken as string,
                    refreshToken: session.refreshToken as string,
                });

                if (res.token) {
                    Cookies.set("auth_token", res.token, { expires: 7 });
                    router.push(res.isNewUser ? "/onboarding" : "/home");
                } else {
                    console.error("No token from backend");
                }
            }, 1000);
        } else {
            console.error("Sign-in failed");
        }
    };

    return (
        <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 bg-white text-black hover:shadow-md transition-all"
            style={{
                backgroundImage:
                    "linear-gradient(90deg, hsla(0,0%,100%,0.5), hsla(0,0%,100%,0))",
            }}
        >
            <Image
                src="/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="pointer-events-none"
            />
            <span className="text-sm font-medium">Sign in with Google</span>
        </button>
    );
}
