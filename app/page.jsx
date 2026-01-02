"use client";

import { useRouter } from "next/navigation";
import {
  NotebookPen,
  Search,
  Lock,
  Globe,
  Users,
  Zap,
  Shield,
  ArrowRight,
  FileText,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "@/styles/home.css";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  if (!mounted) {
    return <div className="home-loader">Loading...</div>;
  }

  return (
    <div className="home">
      {/* HEADER */}
      <header className="home-header">
        <div className="container home-header-inner">
          <div className="home-logo">
            <NotebookPen size={32} />
            <div>
              <strong>Web Notes</strong>
              <span>Smart notes</span>
            </div>
          </div>

          <div className="home-header-actions">
            <ThemeToggle />
            <button
              className="home-btn-secondary"
              onClick={() => router.push("/auth/login")}
            >
              Sign in
            </button>
            <button
              className="home-btn-primary"
              onClick={() => router.push("/auth/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Your notes
          <span>Always available, always secure</span>
        </h1>

        <p className="home-hero-subtitle">
          Simple, secure, and powerful online note-taking experience with smart
          search and collaboration.
        </p>

        <div className="home-hero-actions">
          <button
            className="home-btn-primary"
            onClick={() => router.push("/auth/register")}
          >
            Get started <ArrowRight size={18} />
          </button>
          <button
            className="home-btn-secondary"
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="container home-stats-grid">
          <Stat icon={<FileText size={24} />} value="100,000+" label="Daily notes" />
          <Stat icon={<Users size={24} />} value="50,000+" label="Active users" />
          <Stat icon={<Clock size={24} />} value="99.9%" label="Uptime" />
          <Stat icon={<Star size={24} />} value="4.9/5" label="Satisfaction" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-features">
        <h2>Why Web Notes?</h2>

        <div className="home-features-grid">
          <Feature
            icon={<Lock size={32} />}
            title="Top-notch security"
            text="End-to-end encrypted notes."
          />
          <Feature
            icon={<Search size={32} />}
            title="Smart search"
            text="Find notes instantly."
          />
          <Feature
            icon={<Globe size={32} />}
            title="Multilingual"
            text="RTL & LTR language support."
          />
          <Feature
            icon={<Users size={32} />}
            title="Collaboration"
            text="Work with your team."
          />
          <Feature
            icon={<Zap size={32} />}
            title="Fast"
            text="Optimized for performance."
          />
          <Feature
            icon={<Shield size={32} />}
            title="Privacy-first"
            text="No ads. No tracking."
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="home-benefits">
        <h2>Everything you need</h2>

        <ul className="home-benefits-list">
          {[
            "No installation required",
            "Sync across devices",
            "24/7 support",
            "Version history",
            "Import / export",
            "Dark & light theme",
          ].map((item) => (
            <li key={item}>
              <CheckCircle size={20} /> {item}
            </li>
          ))}
        </ul>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-testimonials">
        <h2>What users say</h2>

        <div className="home-testimonials-grid">
          <Testimonial
            name="Alex Johnson"
            role="Medical Student"
            text="Best tool for studying."
          />
          <Testimonial
            name="Priya Patel"
            role="Software Engineer"
            text="Collaboration is seamless."
          />
          <Testimonial
            name="Maria Lopez"
            role="Journalist"
            text="I trust it with sensitive notes."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to get started?</h2>
        <p>Start using Web Notes today.</p>

        <div className="home-cta-actions">
          <button
            className="home-btn-primary"
            onClick={() => router.push("/auth/register")}
          >
            Start free trial
          </button>
          <button
            className="home-btn-secondary"
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Web Notes</p>
      </footer>
    </div>
  );
}

/* ---------- Components ---------- */

function Feature({ icon, title, text }) {
  return (
    <div className="home-feature">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="home-stat">
      {icon}
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Testimonial({ name, role, text }) {
  return (
    <div className="home-testimonial">
      <strong>{name}</strong>
      <span>{role}</span>
      <p>"{text}"</p>
    </div>
  );
}
