import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail, Lock, User, Eye, EyeOff, Brain, Zap } from "lucide-react";

interface AuthProps {
  onSignIn: (user: { name: string; email: string }) => void;
}

export const Auth = ({ onSignIn }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    onSignIn({
      name: formData.name || "Guest User",
      email: formData.email
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-modern flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-primary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">DocuSense</span>
              <div className="flex items-center space-x-1 mt-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Intelligence</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Document Intelligence Platform
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Transform your PDFs into intelligent, accessible experiences with AI-powered analysis and universal accessibility features.
          </p>
        </div>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Sign up to start analyzing your documents"
                : "Sign in to access your document intelligence"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSignIn({ name: "Demo User", email: "demo@docusense.ai" })}
            >
              <FileText className="w-4 h-4 mr-2" />
              Try Demo
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
              <Brain className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-foreground">AI Analysis</p>
            </div>
            <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-foreground">Smart Extraction</p>
            </div>
            <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium text-foreground">Accessibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};