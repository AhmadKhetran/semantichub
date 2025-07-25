"use client";

import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InviteData {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  expiresAt: string;
  isExpired: boolean;
}

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch("/api/user/accept-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept invitation");
      }

      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError("Failed to accept invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // if (submitting) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <Card className="w-full max-w-md">
  //         <CardContent className="flex items-center justify-center py-8">
  //           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  //           <span className="ml-2">Loading invitation...</span>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  if (error && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
            <CardDescription>This invitation link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <CardTitle className="text-green-600">Welcome!</CardTitle>
            <CardDescription>
              Your account has been created successfully. You will be redirected to the login page shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // if (inviteData?.isExpired) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <Card className="w-full max-w-md">
  //         <CardHeader className="text-center">
  //           <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //           <CardTitle className="text-red-600">Invitation Expired</CardTitle>
  //           <CardDescription>
  //             This invitation has expired. Please contact your administrator for a new invitation.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button onClick={() => router.push("/login")} className="w-full">
  //             Go to Login
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Semantic Hub</CardTitle>
          <CardDescription>You've been invited to join our team at Semantic Hub</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="mb-2">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {/* <p>Invitation expires on {inviteData && new Date(inviteData.expiresAt).toLocaleDateString()}</p> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
