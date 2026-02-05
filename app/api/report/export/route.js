import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    // Check admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Unauthorized" }),
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({ ok: false, error: "Admin access required" }),
        { status: 403 }
      );
    }

    // For now, return a placeholder PDF
    // In production, you would use a library like pdfkit or html-pdf
    const pdfContent = Buffer.from(
      "%PDF-1.4\n" +
      "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
      "3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n" +
      "xref\n" +
      "0 4\n" +
      "0000000000 65535 f\n" +
      "0000000009 00000 n\n" +
      "0000000058 00000 n\n" +
      "0000000115 00000 n\n" +
      "trailer<</Size 4/Root 1 0 R>>\n" +
      "startxref\n" +
      "202\n" +
      "%%EOF"
    );

    return new Response(pdfContent, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="system-report-${new Date().toISOString().split("T")[0]}.pdf"`
      }
    });
  } catch (err) {
    console.error("Export route error:", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
