import React from "react";
import Navbar from "../(components)/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    try {
      await dbConnect();
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          await User.create({
            name: user.fullName || "New User",
            email: email,
            password: "", // No password since they use Clerk
          });
        }
      }
    } catch (error) {
      console.error("Failed to sync user with MongoDB:", error);
    }
  } else {
    redirect("/sign-in");
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] antialiased">
      <Navbar />
      <main className="px-4 py-6 mt-[100px] max-w-7xl mx-auto">
        {children}
      </main>
    </section>
  );
}
