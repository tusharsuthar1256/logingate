import React from "react";
import Navbar from "../(components)/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { redirect } from "next/navigation";

import { sendWelcomeEmail } from "@/lib/mailservice";

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
            clerkId: user.id,
            password: "", // No password since they use Clerk
          });
          // Send Welcome Email
          await sendWelcomeEmail(email, user.firstName || "there");
        } else if (!existingUser.clerkId) {
          existingUser.clerkId = user.id;
          await existingUser.save();
        }
      }
    } catch (error) {
      console.error("Failed to sync user with MongoDB:", error);
    }
  } else {
    redirect("/login");
  }

  return (
    <section className="min-h-screen bg-[#0A0A0B] antialiased text-white">
      <Navbar />
      <main className="px-4 py-6 mt-[100px] max-w-7xl mx-auto">
        {children}
      </main>
    </section>
  );
}
