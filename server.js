import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Lee tus secrets desde Replit (🔑 panel "Secrets")
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Replit define PORT automáticamente
const PORT = process.env.PORT || 3000;

// Rutas
app.get("/", (_req, res) => {
  res.send("✅ Bridge activo en Replit");
});

app.post("/ingest", async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).send("Faltan SUPABASE_URL o SUPABASE_KEY");
    }

    const r = await fetch(`${SUPABASE_URL}/rest/v1/coordenadas`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    console.log("📡 Recibido:", req.body);
    console.log("📤 Supabase respondió:", text);
    res.status(200).send("OK");
  } catch (e) {
    console.error("❌ Error:", e);
    res.status(500).send("Error interno");
  }
});

// 👇 clave: bind en 0.0.0.0 y usar el PORT de Replit
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor HTTP escuchando en 0.0.0.0:${PORT}`);
});

