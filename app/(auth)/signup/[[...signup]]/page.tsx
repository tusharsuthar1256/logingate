import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0A0A0B]">
            <SignUp path="/signup" routing="path" signInUrl="/login" fallbackRedirectUrl="/dashboard" />
        </div>
    );
}
