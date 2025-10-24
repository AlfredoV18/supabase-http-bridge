// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Lee config desde variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 10000;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("⚠️ Falta SUPABASE_URL o SUPABASE_KEY en variables de entorno.");
}

app.post("/ingest", async (req, res) => {
  try {
    console.log("📡 Recibido:", req.body);

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
    console.log("📤 Supabase respondió:", text);
    res.status(200).send("OK");
  } catch (e) {
    console.error("❌ Error:", e);
    res.status(500).send("Error");
  }
});

app.get("/", (_req, res) => res.send("✅ Bridge activo"));

app.listen(PORT, () => console.log(`Servidor HTTP escuchando en puerto ${PORT}`));
