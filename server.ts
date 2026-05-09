import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy ArXiv PDFs
  app.post("/api/fetch-arxiv", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      // Normalize URL to PDF link
      // ArXiv URLs can be: https://arxiv.org/abs/2405.12345 or https://arxiv.org/pdf/2405.12345
      let pdfUrl = url.trim();
      if (pdfUrl.includes("arxiv.org/abs/")) {
        pdfUrl = pdfUrl.replace("arxiv.org/abs/", "arxiv.org/pdf/");
      }
      if (!pdfUrl.endsWith(".pdf") && !pdfUrl.includes("arxiv.org/pdf/")) {
        // Simple heuristic for other ArXiv variations
      }
      if (pdfUrl.includes("arxiv.org") && !pdfUrl.endsWith(".pdf")) {
        pdfUrl = `${pdfUrl}.pdf`;
      }

      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`Failed to fetch from ${pdfUrl}`);

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      
      res.json({ base64 });
    } catch (error: any) {
      console.error("ArXiv Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch ArXiv paper. Ensure the URL is valid." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
