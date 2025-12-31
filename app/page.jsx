"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ArrowRight, CheckCircle, Users, Shield, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import "@/styles/home.css";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add loading state for better UX
    const timer = setTimeout(() => {
      setLoading(false);
      if (status === "authenticated") {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Loading Content */}
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              NEW
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Web Notes
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 animate-slide-up">
            Your thoughts, organized beautifully
          </p>
          
          <div className="space-y-4 mb-8 animate-slide-up delay-200">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Secure & encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Persian & English support</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Real-time sync across devices</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-gray-400 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading your workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Version 2.0 is here!
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Notes,
              </span>
              <span className="block bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mt-2">
                Perfected.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in delay-100">
              A modern note-taking experience that blends simplicity with power. 
              Organize your thoughts in Persian or English with advanced search, 
              real-time collaboration, and military-grade security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
              <button
                onClick={() => router.push("/auth/register")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => router.push("/auth/login")}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-xl"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16 animate-fade-in delay-300">
            <div className="text-center p-6 glass rounded-2xl hover-lift">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center p-6 glass rounded-2xl hover-lift">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Notes Created</div>
            </div>
            <div className="text-center p-6 glass rounded-2xl hover-lift">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center p-6 glass rounded-2xl hover-lift">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Packed with features designed to make note-taking effortless and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 glass rounded-3xl hover-lift group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Military-Grade Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your notes are encrypted end-to-end with AES-256 encryption. 
                We never store your data in plain text.
              </p>
            </div>

            <div className="p-8 glass rounded-3xl hover-lift group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built for speed with Next.js 14 and MongoDB. 
                Search thousands of notes in milliseconds.
              </p>
            </div>

            <div className="p-8 glass rounded-3xl hover-lift group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborate in Real-Time</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share notes with teammates and collaborate in real-time. 
                See changes as they happen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Note-Taking?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already discovered the perfect 
                way to organize their thoughts and ideas.
              </p>
              
              <button
                onClick={() => router.push("/auth/register")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}