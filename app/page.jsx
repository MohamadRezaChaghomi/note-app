"use client";

import { useRouter } from "next/navigation";
import { 
  NotebookPen, 
  Search, 
  Lock, 
  Globe, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Shield,
  Zap,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Target
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Top-notch security",
      description: "Your notes are protected with end-to-end encryption — only you can access them.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart search",
      description: "Find notes instantly with fast, accurate full-text search across your content.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual support",
      description: "Optimized editor and search for multiple languages, including right-to-left scripts.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team collaboration",
      description: "Share notes with teammates and collaborate in real time with simple permissions.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Blazing fast",
      description: "Built on Next.js and optimized for speed to keep you productive.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy-first",
      description: "We don’t sell your data or show ads — your work stays private.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const benefits = [
    "No installation required",
    "Automatic syncing across devices",
    "24/7 support",
    "Automatic note versioning",
    "Import/export in multiple formats",
    "Smart dark/light theme"
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Medical Student",
      content: "Best tool for summarizing lectures — search is fast and accurate.",
      avatar: "AJ"
    },
    {
      name: "Priya Patel",
      role: "Software Engineer",
      content: "Team collaboration is seamless. It saved us a lot of time.",
      avatar: "PP"
    },
    {
      name: "Maria Lopez",
      role: "Journalist",
      content: "The platform's security gives me confidence to store sensitive notes.",
      avatar: "ML"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container">
          <nav className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg">
                <NotebookPen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                  Web Notes
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Smart notes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="btn btn-secondary px-6"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="btn btn-primary px-6"
              >
                Start free
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-lg relative overflow-hidden home-hero">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container">
          <div dir="ltr" className="hero-inner max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Version 2.0 — 50k+ active users
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
              <span className="block text-gray-900 dark:text-white mb-4">
                Your notes
              </span>
              <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent animate-gradient">
                Always available, always secure
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: "0.1s"}}>
              Simple, secure, and powerful. A modern online note-taking experience with advanced search, intelligent organization, and seamless collaboration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up hero-cta" style={{animationDelay: "0.2s"}}>
              <button
                onClick={() => router.push("/auth/register")}
                className="btn btn-primary px-8 py-4 text-lg"
              >
                <span>Get started — Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => router.push("/auth/login")}
                className="btn btn-secondary px-8 py-4 text-lg"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm">
        <div className="container">
          <div className="grid-system-4 gap-8">
            {[
              { value: "100,000+", label: "Daily notes", icon: <FileText className="w-6 h-6" /> },
              { value: "50,000+", label: "Active users", icon: <Users className="w-6 h-6" /> },
              { value: "99.9%", label: "Uptime", icon: <Clock className="w-6 h-6" /> },
              { value: "4.9/5", label: "User satisfaction", icon: <Star className="w-6 h-6" /> }
            ].map((stat, idx) => (
              <div key={idx} className="card text-center hover-lift">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Web Notes?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              All the tools you need to organize your thoughts and ideas in one secure platform.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="card-hover group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-sm bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Everything you need — and more
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                Web Notes is more than a note app — it’s a complete ecosystem for personal and team knowledge management.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="gradient-border p-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-600 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-full w-4/6"></div>
                  </div>
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mt-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              What our users say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of satisfied users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="card hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm cta-section">
        <div className="container">
          <div className="gradient-border p-8 md:p-12">
            <div dir="ltr" className="text-center cta-inner max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Ready to get started?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of happy users today and transform the way you take notes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="btn btn-primary px-8 py-4 text-lg"
                >
                  <span>Start free trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => router.push("/auth/login")}
                  className="btn btn-secondary px-8 py-4 text-lg"
                >
                  Sign in to existing account
                </button>
              </div>
              
              <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                    <NotebookPen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Web Notes
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  The best online note-taking experience focused on security and simplicity
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">API</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help Center</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</button></li>
                  <li><button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</button></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} Web Notes. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
