"use client";

import { useRouter } from "next/navigation";
import { Loader2, Sparkles, ArrowRight, CheckCircle, Users, Shield, Zap, Star, Globe, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: "10K+", notes: "1M+", uptime: "99.9%", support: "24/7" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (status === "authenticated") {
        router.push("/dashboard");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Web Notes
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            در حال بارگذاری فضای کاری شما...
          </p>
          
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>لطفاً صبر کنید</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web Notes
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ورود
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                شروع رایگان
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                نسخه ۲.۰ منتشر شد!
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                یادداشت‌های شما،
              </span>
              <span className="block text-gray-800 dark:text-gray-100 mt-2">
                به بهترین شکل سازماندهی شده.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              تجربه‌ای مدرن از یادداشت‌نویسی که سادگی را با قدرت ترکیب می‌کند. 
              افکار خود را به فارسی یا انگلیسی با جستجوی پیشرفته، همکاری آنی و امنیت نظامی سازماندهی کنید.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/auth/register")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl"
              >
                <span className="relative flex items-center gap-2">
                  شروع رایگان
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => router.push("/auth/login")}
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 font-semibold rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-xl"
              >
                ورود به حساب
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-20">
            {[
              { value: stats.users, label: "کاربر فعال", icon: Users, color: "blue" },
              { value: stats.notes, label: "یادداشت ایجاد شده", icon: Star, color: "purple" },
              { value: stats.uptime, label: "آپ‌تایم", icon: Zap, color: "green" },
              { value: stats.support, label: "پشتیبانی", icon: Shield, color: "pink" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 glass rounded-2xl hover-lift">
                <stat.icon className={`w-8 h-8 text-${stat.color}-500 dark:text-${stat.color}-400 mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              تمام آنچه نیاز دارید
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              امکاناتی طراحی شده برای لذت‌بخش‌تر کردن یادداشت‌نویسی
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "امنیت نظامی",
                description: "یادداشت‌های شما با رمزنگاری end-to-end محافظت می‌شوند. ما هرگز داده‌های شما را به صورت متن ساده ذخیره نمی‌کنیم.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: "سرعت بالا",
                description: "ساخته شده با Next.js 14 و MongoDB. هزاران یادداشت را در میلی‌ثانیه جستجو کنید.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Users,
                title: "همکاری آنی",
                description: "یادداشت‌ها را با همکاران به اشتراک بگذارید و به صورت همزمان همکاری کنید. تغییرات را همان لحظه ببینید.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Globe,
                title: "پشتیبانی دو زبانه",
                description: "یادداشت‌نویسی همزمان به فارسی و انگلیسی با جستجوی هوشمند در هر دو زبان.",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: Shield,
                title: "حریم خصوصی کامل",
                description: "کنترل کامل روی داده‌های خود داشته باشید. ما داده‌های شما را نمی‌فروشیم یا به اشتراک نمی‌گذاریم.",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: Sparkles,
                title: "طراحی زیبا",
                description: "تجربه کاربری دلپذیر با تم‌های تاریک/روشن و طراحی واکنش‌گرا برای تمام دستگاه‌ها.",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-6 glass rounded-3xl hover-lift transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                آماده‌اید تجربه یادداشت‌نویسی را متحول کنید؟
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                به هزاران کاربری بپیوندید که قبلاً راه‌حل ایده‌آل برای سازماندهی افکار و ایده‌های خود را کشف کرده‌اند.
              </p>
              
              <button
                onClick={() => router.push("/auth/register")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl inline-flex items-center gap-2"
              >
                شروع دوره آزمایشی رایگان
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                بدون نیاز به کارت اعتباری • ۱۴ روز آزمایشی رایگان • لغو در هر زمان
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web Notes
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Web Notes. تمام حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}