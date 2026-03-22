"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, School as SchoolIcon, Users, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Auth roles validation
  const validRoles = ["student", "teacher", "principal"];
  const isValidRole = validRoles.includes(role);

  if (!isValidRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
        <h1 className="text-2xl font-bold text-red-600">Invalid Role</h1>
        <p className="mt-2 text-slate-600">Please select a valid role to login.</p>
        <Button asChild className="mt-4">
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  const roleConfig = {
    student: { title: "Student", icon: GraduationCap, color: "text-red-600" },
    teacher: { title: "Teacher", icon: Users, color: "text-emerald-600" },
    principal: { title: "Principal", icon: SchoolIcon, color: "text-red-600" },
  }[role as "student" | "teacher" | "principal"];

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const fullName = formData.get("fullName");
    
    if (mode === "signup" && role === "student") {
      // Store notification for Principal
      const notifications = JSON.parse(localStorage.getItem("admin_notifications") || "[]");
      notifications.push({
        id: Date.now(),
        type: "student_signup",
        message: `New student registration: ${fullName} (${email})`,
        time: new Date().toISOString(),
        read: false
      });
      localStorage.setItem("admin_notifications", JSON.stringify(notifications));
    }

    toast.success(`${mode === "login" ? "Logged in" : "Signed up"} successfully!`);
    setIsLoading(false);
    
    // Redirect based on role
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute top-8 left-8">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className={`p-3 rounded-full bg-slate-100 ${roleConfig?.color}`}>
              {roleConfig && <roleConfig.icon className="w-8 h-8" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {roleConfig?.title} Portal
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full" onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <TabsContent value="signup" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="John Doe" required={mode === "signup"} />
                </div>
              </TabsContent>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <Link href="#" className="text-xs text-red-600 hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input id="password" name="password" type="password" required />
              </div>

              <Button type="submit" className="w-full mt-2 bg-slate-900" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <div className="text-sm text-slate-500">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
