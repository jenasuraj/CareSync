import type { Metadata } from "next";
import LoginPage from "@/ui/loginpage/LoginPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login page",
  description: "Access the dashboard via login page",
};

const Page = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
      <section className="flex items-center justify-center min-h-screen text-white">
        <LoginPage/>
      </section>
    </Suspense>
  );
};

export default Page;