"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function MigrationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFixSlugs = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/migrate/fix-slugs", {
        method: "POST"
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Migration failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1>Database Migrations</h1>

      <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Fix Note Slugs</h2>
        <p>This migration will fix the E11000 duplicate key error by generating unique slugs for all notes.</p>

        <Button
          onClick={handleFixSlugs}
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />}
          {loading ? "Running Migration..." : "Run Migration"}
        </Button>

        {error && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fee", borderRadius: "4px", display: "flex", gap: "10px" }}>
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p style={{ fontWeight: "bold", color: "#c33" }}>Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#efe", borderRadius: "4px", display: "flex", gap: "10px" }}>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p style={{ fontWeight: "bold", color: "#060" }}>Success</p>
              <p>{result.message}</p>
              {result.errors && result.errors.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <p style={{ fontSize: "0.9em" }}>Errors: {result.errors.length}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
