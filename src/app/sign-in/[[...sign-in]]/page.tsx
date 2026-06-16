"use client";

import { useState } from "react";
import { loginUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      await loginUser(username);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-6">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-poppins">
            Welcome to CarbonWise
          </CardTitle>
          <CardDescription>
            Enter any username to test the MVP. No password required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter a username (e.g. test_user)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
