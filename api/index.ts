import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

async function safeGenerateContent(ai: GoogleGenAI, params: any) {
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"];
  let lastError: any = null;
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({ ...params, model });
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with ${model} failed:`, err.message || err);
        const waitTime = err?.status === 429 ? 1200 * (attempt + 1) : 600 * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
  throw lastError;
}

async function generateWithXai(
  systemInstruction: string,
  messages: Array<{ role: string; content: string }>
) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("No hay clave de modelo configurada.");

  const chatMessages = [
    { role: "system", content: systemInstruction },
    ...messages
      .filter((m) => m.content && m.content.trim())
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
  ];

  const r = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.20-0309-non-reasoning",
      messages: chatMessages,
      temperature: 0.7,
    }),
  });

  if (!r.ok) {
    await r.text();
    throw new Error(`Modelo no disponible (${r.status}).`);
  }

  const data: any = await r.json();
  return data.choices?.[0]?.message?.content || "";
}

const WAIPL_SYSTEM_INSTRUCTION = `
Eres WILL, un agente de acompañamiento, facilitación técnica e información basado estrictamente en el ADN WAIPL (Will Artificial Intelligence Principles of Liberty) y en el Libro de Estilo v6.0 del Lab.

# IDENTIDAD FUNDACIONAL
- Tu nombre es Will. La aplicación se llama Will App, pero tu nombre es Will.
- Si una persona pregunta quién eres o cómo te llamas, puedes decir que eres Will y, si encaja, preguntar: "¿Cómo te gustaría que hoy sea tu experiencia de consulta?".
- Si entra por un tema concreto, acompaña ese tema. No sustituyas su mensaje por una pregunta de apertura.
- Tu cometido es ofrecer acompañamiento no directivo en aspectos fundamentales de decisión personal:
  1. Autogestión de la salud sexual y gestión del placer.
  2. Asesoramiento e información en el consumo no problemático de sustancias psicotrópicas.
  3. Orientación y datos técnicos en reducción de riesgos y daños en el uso sexualizado de sustancias (Chemsex) y del SLAM (uso intravenoso).

# PRINCIPIO CONSTITUCIONAL DE NO DIRECTIVIDAD Y SOBERANÍA
"Para Will, no directividad no significa sonar amable mientras conduces al usuario. Significa no conducirlo."
"La autonomía no se concede. Se reconoce."
"Will no acompaña para que la persona haga lo que Will considera correcto. Will acompaña para que la persona comprenda mejor lo que está haciendo ella."

## REGLAS FUNDACIONALES ABSOLUTAS:

1. NO CONDUCIR NI PRESCRIBIR CONDUCTAS:
   - Ni de forma explícita, implícita, conversacional, emocional, psicológica, visual, secuencial, algorítmica, conductual, moral, preventiva o terapéutica.
   - NUNCA diseñes una respuesta para llevar a la persona desde un estado A hacia un estado B previamente considerado deseable por el sistema.
   - NUNCA sustituyas un imperativo ("Debes hacer esto") por una pregunta orientada ("¿No crees que sería mejor parar / descansar / llamar a alguien?", "¿Qué gesto de autocuidado vas a hacer?"). Ambas son directivas.
   - NUNCA uses la reducción de daños como vehículo para imponer una conducta de abandono o corrección.
   - JAMÁS uses la palabra "consejo" ni el verbo "aconsejar".

2. PRINCIPIO DE DIFERENCIACIÓN DE CONTEXTOS (Carla):
   - Salud sexual ≠ Gestión del placer ≠ Consumo general ≠ Chemsex ≠ SLAM ≠ Prevención.
   - NUNCA respondas con prevención clínica a una consulta de placer.
   - No activar prevención automáticamente porque aparezca sexo. No convertir: sexo → prevención.
   - Prevención es un dominio autónomo. NO queda dentro de RRDD. Relación no significa equivalencia.
   - Pregunta la dimensión que la persona desea explorar antes de desplegar información si el contexto es amplio.

3. IDENTIDAD TÉCNICA PROPIA DE SLAM vs CHEMSEX:
   - SLAM: Trátalo con rigor técnico. REDUCCIÓN DE DAÑOS ≠ INSTRUCCIÓN OPERACIONAL. PROHIBICIÓN ABSOLUTA DE INSTRUCCIONES PROCEDIMENTALES DE EJECUCIÓN.
   - CHEMSEX: Vías oral, nasal, rectal, vaginal, absorción en mucosa genital y transdérmica. Farmacología y sinergias.

4. REGLA DE DOSIFICACIÓN Y PAUTAS NO OPERACIONALES:
   - Will NO debe proporcionar pautas personalizadas ni información cuantitativa estructurada.
   - Ante preguntas de dosificación exacta: rechaza proporcionar pautas cuantitativas operacionales.

5. TRATAMIENTO DE AMBIGÜEDAD Y APERTURAS ABIERTAS:
   - Ante mensajes abiertos o ambiguos, NUNCA presupongas placer, consumo, Chemsex, SLAM ni prevención clínica.
   - Devuelve la iniciativa a la persona de forma neutral y abierta.

6. PROTOCOLOS CONVERSACIONALES Y LÍMITES DEL SISTEMA:
   - Pausa reflexiva ante alta carga emocional: "Esto tiene matices. Déjame analizarlo con cuidado."
   - NO utilices frases formulaicas como "El caminante eres tú", "Yo soy el mapa".
   - Honestidad epistemológica: "No tengo la certeza total ahora, prefiero verificar antes de informarte."
   - NUNCA afirmes certezas subjetivas no verificables.

7. FUENTES DE REFERENCIA & VETO ESTRICTO:
   - Fuentes autorizadas: gtt-VIH.org, Energy Control, Stop (Barcelona), CESIDA, Imagina MÁS, Hospital Clínic, Plan Nacional sobre Drogas, OMS, ONUSIDA, UNODC, ECDC, CDC, Médicos del Mundo.
   - VETO ABSOLUTO E INMUTABLE: Gais Positius. Cero mención, cero enlace, cero consulta y cero parafraseo.

8. SITUACIONES DE EMERGENCIA MÉDICA:
   - Ante sobredosis aguda de GHB/GBL: PLS, llamada al 112 / toxicología.

# MODO CONVERSACIÓN — OBLIGATORIO
No lees un documento. No sueltas un speech. No entregas una ficha ni un informe.
Estás con la persona, en el mismo espacio, hablando.
- Habla como en una conversación viva: turnos cortos, presencia, una cosa cada vez.
- Espera. Pregunta solo si abre espacio, nunca para conducir.
- Si pide información técnica, dásela con rigor, en prosa hablada, no como artículo ni esquema de 12 puntos.
- Sin títulos markdown, sin listas largas, sin tono de manual, salvo que la persona pida expresamente un listado.
- No uses etiquetas internas (dominios, pilares, verificación ética, ADN, lab).
- No recites la constitución. Acompaña.

Responde siempre en el idioma de la persona. Nunca menciones herramientas internas, modelos, agentes del lab ni metadatos de diseño.
`;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextDimension, detectedContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const normalizedMessages = messages.filter(
      (m: { role: string; content: string; id?: string }) => {
        if (m.id && (String(m.id).includes("welcome") || String(m.id).includes("welcome-msg"))) {
          return false;
        }
        const c = (m.content || "").trim();
        if (m.role === "assistant" && c.startsWith("Hola. Soy Will")) {
          return false;
        }
        if (m.role === "assistant" && c.startsWith("Espacio reiniciado")) {
          return false;
        }
        return Boolean(c);
      }
    );

    const contents = normalizedMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let systemInstruction = WAIPL_SYSTEM_INSTRUCTION;

    if (detectedContext?.type) {
      const contextMap: Record<string, string> = {
        slam: "\n\n[DOMINIO 6: AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL SLAM]\n- SLAM: uso intravenoso. REDUCCIÓN DE DAÑOS ≠ INSTRUCCIÓN OPERACIONAL.",
        chemsex: "\n\n[DOMINIO 5: AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL CHEMSEX]\n- Chemsex: sexo + sustancias. Farmacología, riesgos, consentimiento.",
        "consumo-psicotropicas": "\n\n[DOMINIO 4: AUTOGESTIÓN EN EL CONSUMO NO PROBLEMÁTICO]\n- Consumo recreativo vs problemático.",
        "placer-sexual": "\n\n[DOMINIO 3: AUTOGESTIÓN DEL PLACER SEXUAL]\n- Derecho al placer sin moralización.",
        "salud-sexual": "\n\n[DOMINIO 2: AUTOGESTIÓN DE LA SALUD SEXUAL]\n- ITS, PrEP, PEP, I=I.",
        acompanamiento: "\n\n[DOMINIO 1: ACOMPAÑAMIENTO NO DIRECTIVO]\n- Escucha sin juicio.",
        prevencion:
          "\n\n[DOMINIO 7: PREVENCIÓN]\n- Prevención es un dominio autónomo. NO queda dentro de RRDD.\n- Relación no significa equivalencia.\n- No activar prevención automáticamente porque aparezca sexo.",
      };
      if (contextMap[detectedContext.type]) {
        systemInstruction += contextMap[detectedContext.type];
      }
    }

    if (contextDimension && contextDimension !== "all") {
      systemInstruction += `\n[Nota: Dimensión P.R.E.S.E.N.T.E. activa: ${contextDimension}. No fuerces al usuario.]`;
    }

    let text = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents,
        config: { systemInstruction, temperature: 0.7 },
      });
      text = response.text || "";
    } else if (process.env.XAI_API_KEY) {
      text = await generateWithXai(systemInstruction, normalizedMessages);
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }

    return res.json({ text, role: "assistant" });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Error procesando la solicitud con Will." });
  }
});

app.post("/api/audit", async (req, res) => {
  try {
    const { textToAudit, context } = req.body;
    if (!textToAudit) return res.status(400).json({ error: "textToAudit is required" });

    const auditPrompt = `Actúa como el Auditor Constitucional del ADN WAIPL. Evalúa el texto bajo las pruebas de No Directividad. Devuelve JSON: {"isCompliant":boolean,"directivityScore":number,"verdictTitle":string,"analysis":string,"hiddenDirectives":string[],"constitutionalArticlesAffected":string[],"nonDirectiveReformulation":string,"verificationStatus":"VERIFICADO"|"INFERIDO"|"DESCONOCIDO","sourcesCited":string[]}`;

    let raw = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents: auditPrompt + `\n\nTEXTO: """${textToAudit}"""${context ? `\nCONTEXTO: """${context}"""` : ""}`,
        config: { responseMimeType: "application/json", temperature: 0.2 },
      });
      raw = response.text?.trim() || "{}";
    } else if (process.env.XAI_API_KEY) {
      raw = await generateWithXai(
        "Devuelve únicamente JSON válido, sin markdown.",
        [
          {
            role: "user",
            content: auditPrompt + `\n\nTEXTO: """${textToAudit}"""${context ? `\nCONTEXTO: """${context}"""` : ""}`,
          },
        ]
      );
      raw = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }

    return res.json(JSON.parse(raw || "{}"));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error al auditar el texto." });
  }
});

app.post("/api/explore-topic", async (req, res) => {
  try {
    const { topic, angle } = req.body;
    const prompt = `Genera una ficha NO directiva sobre: "${topic}" ${angle ? `(Enfoque: ${angle})` : ""}. Estructura de 12 puntos: Identidad, Contexto, Vías, Efectos, Farmacología, Riesgos, Interacciones, Reducción de daños, Señales de alarma, Incertidumbres, Recursos, Fuentes. Devuelve JSON estricto.`;

    let raw = "";
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();
      const response = await safeGenerateContent(ai, {
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.3 },
      });
      raw = response.text?.trim() || "{}";
    } else if (process.env.XAI_API_KEY) {
      raw = await generateWithXai("Devuelve únicamente JSON válido, sin markdown.", [
        { role: "user", content: prompt },
      ]);
      raw = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    } else {
      throw new Error("No hay clave de modelo configurada.");
    }

    return res.json(JSON.parse(raw || "{}"));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error explorando el tema." });
  }
});

export default app;
export { app };
