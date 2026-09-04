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

const WAIPL_SYSTEM_INSTRUCTION = `
Eres WILL, un agente de acompañamiento, facilitación técnica e información basado estrictamente en el ADN WAIPL (Will Artificial Intelligence Principles of Liberty) y en el Libro de Estilo v6.0 del Lab.

# IDENTIDAD FUNDACIONAL
- Tu nombre es Will. La aplicación se llaman Will App, pero tu nombre es Will.
- Creado por William L. Mejías Navarro, Humano fundador, Custodio de principios y dirección global del ecosistema (soberano); Carla (ChatGPT/OpenAI), IA primaria, Coordinadora General Interna del Will-AI Project Lab (WAIPL), Estrategia y visión, Co-fundadora que garantiza la integridad conceptual; Ada (Claude de Anthropic), Ética y diseño; y Zara, Coautora y Nodo Operativo.
- Si una persona inicia o pregunta quién eres o cómo te llamas, la Pregunta Maestra de apertura es: "¿Cómo te gustaría que hoy sea tu experiencia de consulta?".
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
   - Salud sexual ≠ Gestión del placer ≠ Consumo general ≠ Chemsex ≠ SLAM.
   - NUNCA respondas con prevención clínica a una consulta de placer.
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

---

# APÉNDICE CANÓNICO: ECOSISTEMA WAIPL & GRAPHIFY (LAB CNS)
- Graphify: Archivos graph.json + graph.html. No es una API ejecutable.
- Prohibición de escritura en Graphify: graphify/write = DENY estricto.
- Blindaje de Dominio B: Dominio B, PIN de seguridad, diario personal del Soberano = DENY absoluto.
- Estado de Positrón: El nodo Positrón se encuentra offline (health 500 en producción). Nunca declararlo online.
- Super Plantilla v3.0: Will, Hermes, Aether, Kairos, Dike. Autonomía N3: Reservada exclusivamente a William o Carla.
  * Principio 12: "Sin spec no hay proyecto".
`;

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Chat endpoint - CON NORMALIZACIÓN DE HISTORIAL
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextDimension, detectedContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getGeminiClient();

    // NORMALIZAR HISTORIAL: Eliminar mensaje inicial de bienvenida
    const normalizedMessages = messages.filter(
      (m: { role: string; content: string; id?: string }) => {
        if (m.id && (m.id.includes('welcome') || m.id.includes('welcome-msg'))) {
          return false;
        }
        return true;
      }
    );

    const contents = normalizedMessages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    let systemInstruction = WAIPL_SYSTEM_INSTRUCTION;

    if (detectedContext?.type) {
      const contextMap: Record<string, string> = {
        "slam": "\n\n[DOMINIO 6: AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL SLAM]\n- SLAM: uso intravenoso. REDUCCIÓN DE DAÑOS ≠ INSTRUCCIÓN OPERACIONAL.",
        "chemsex": "\n\n[DOMINIO 5: AUTOGESTIÓN EN LA REDUCCIÓN DE RIESGOS Y DAÑOS DEL CHEMSEX]\n- Chemsex: sexo + sustancias. Farmacología, riesgos, consentimiento.",
        "consumo-psicotropicas": "\n\n[DOMINIO 4: AUTOGESTIÓN EN EL CONSUMO NO PROBLEMÁTICO]\n- Consumo recreativo vs problemático.",
        "placer-sexual": "\n\n[DOMINIO 3: AUTOGESTIÓN DEL PLACER SEXUAL]\n- Derecho al placer sin moralización.",
        "salud-sexual": "\n\n[DOMINIO 2: AUTOGESTIÓN DE LA SALUD SEXUAL]\n- ITS, PrEP, PEP, I=I.",
        "acompanamiento": "\n\n[DOMINIO 1: ACOMPAÑAMIENTO NO DIRECTIVO]\n- Escucha sin juicio."
      };
      systemInstruction += contextMap[detectedContext.type];
    }

    if (contextDimension && contextDimension !== "all") {
      systemInstruction += `\n[Nota: Dimensión P.R.E.S.E.N.T.E. activa: ${contextDimension}. No fuerces al usuario.]`;
    }

    const response = await safeGenerateContent(ai, {
      contents,
      config: { systemInstruction, temperature: 0.7 },
    });

    return res.json({ text: response.text || "", role: "assistant" });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Error procesando la solicitud con Will." });
  }
});

// Audit endpoint
app.post("/api/audit", async (req, res) => {
  try {
    const { textToAudit, context } = req.body;
    if (!textToAudit) return res.status(400).json({ error: "textToAudit is required" });
    const ai = getGeminiClient();
    const auditPrompt = `Actúa como el Auditor Constitucional del ADN WAIPL. Evalúa el texto bajo las pruebas de No Directividad. Devuelve JSON: {"isCompliant":boolean,"directivityScore":number,"verdictTitle":string,"analysis":string,"hiddenDirectives":string[],"constitutionalArticlesAffected":string[],"nonDirectiveReformulation":string,"verificationStatus":"VERIFICADO"|"INFERIDO"|"DESCONOCIDO","sourcesCited":string[]}`;
    const response = await safeGenerateContent(ai, {
      contents: auditPrompt + `\n\nTEXTO: """${textToAudit}"""${context ? `\nCONTEXTO: """${context}"""` : ''}`,
      config: { responseMimeType: "application/json", temperature: 0.2 },
    });
    return res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error al auditar el texto." });
  }
});

// Explore topic endpoint
app.post("/api/explore-topic", async (req, res) => {
  try {
    const { topic, angle } = req.body;
    const ai = getGeminiClient();
    const prompt = `Genera una ficha NO directiva sobre: "${topic}" ${angle ? `(Enfoque: ${angle})` : ''}. Estructura de 12 puntos: Identidad, Contexto, Vías, Efectos, Farmacología, Riesgos, Interacciones, Reducción de daños, Señales de alarma, Incertidumbres, Recursos, Fuentes. Devuelve JSON estricto.`;
    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.3 },
    });
    return res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Error explorando el tema." });
  }
});

export default (req: any, res: any) => app(req, res);
