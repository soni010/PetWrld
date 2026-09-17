import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// AI Vet & Pet Care Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], petProfile } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();

    // Fallback response generator if Gemini key is not configured or in case of transient error
    if (!ai) {
      const fallbackReply = generateFallbackPetAdvice(message, petProfile);
      res.json({ reply: fallbackReply, source: 'offline_vet_kb' });
      return;
    }

    const petContext = petProfile
      ? `Pet Context: Name: ${petProfile.name || 'Pet'}, Species: ${petProfile.species || 'Dog/Cat'}, Breed: ${petProfile.breed || 'Unknown'}, Age: ${petProfile.age || 'Unknown'}, Weight: ${petProfile.weight || 'Unknown'}kg, Allergies: ${petProfile.allergies || 'None known'}.`
      : 'Pet Context: General pet inquiry.';

    const systemInstruction = `You are Petwrld AI Assistant, an empathetic, highly knowledgeable veterinary consultant and pet behavioral expert built into the Petwrld startup platform.
${petContext}
Guidelines:
1. Provide accurate, kind, evidence-based pet care, nutrition, behavioral training, and wellness advice.
2. If the pet exhibits emergency red-flag symptoms (difficulty breathing, sudden collapse, vomiting blood, chocolate/xylitol ingestion, severe lethargy, seizures, bloating with retching), advise contacting the 24/7 Petwrld Ambulance or immediate emergency veterinary hospital immediately.
3. Be friendly, structured (use bullet points or short paragraphs for readability), and include positive reinforcement tips.
4. Mention relevant Petwrld features when helpful (e.g. Booking a certified online vet consultation, logging vaccines in Pet ID, checking nearest clinics or emergency ambulance).`;

    const contents = [
      ...history.slice(-6).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am here to help you and your furry companion! Could you provide a bit more detail about what symptoms or questions you have?';
    res.json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Graceful fallback so user is never stranded
    const { message, petProfile } = req.body;
    const fallbackReply = generateFallbackPetAdvice(message, petProfile);
    res.json({ reply: fallbackReply, source: 'offline_vet_kb_fallback' });
  }
});

function generateFallbackPetAdvice(query: string, petProfile?: { name?: string; species?: string; breed?: string }): string {
  const q = query.toLowerCase();
  const name = petProfile?.name || 'your pet';

  if (q.includes('chocolate') || q.includes('onion') || q.includes('grape') || q.includes('toxic') || q.includes('poison')) {
    return `🚨 **URGENT DIETARY SAFETY ALERT for ${name}**:
Ingredients like chocolate (theobromine), grapes, raisins, onions, garlic, and artificial sweeteners (xylitol) are toxic to dogs and cats.
- **Immediate action:** Please monitor for vomiting, diarrhea, rapid breathing, or lethargy.
- Contact your nearest 24/7 Emergency Vet Clinic or use the Petwrld **24/7 Ambulance SOS** feature on top of the screen right away. Do not induce vomiting without veterinary instruction.`;
  }

  if (q.includes('vomit') || q.includes('diarrhea') || q.includes('sick') || q.includes('puke')) {
    return `🐾 **Digestive Upset Guidance for ${name}**:
Occasional mild tummy upsets can happen from dietary indiscretion or stress.
1. **Hydration First:** Ensure fresh, clean water is accessible in small, frequent amounts.
2. **Bland Diet:** If vomiting has stopped for a few hours, consider a bland meal like boiled plain white chicken breast and boiled rice (no seasoning or oil).
3. **Red Flags:** If vomiting persists more than 24 hours, if there is blood, severe dehydration, or lethargy, please book an immediate consultation with a certified vet on Petwrld or visit an emergency hospital.`;
  }

  if (q.includes('vaccine') || q.includes('shot') || q.includes('immunization') || q.includes('rabies')) {
    return `💉 **Vaccination Protocols for ${name}**:
- **Core Canine Vaccines:** Rabies, DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza).
- **Core Feline Vaccines:** Rabies, FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia).
- **Boosters:** Usually scheduled annually or every 3 years based on your vet's recommendation.
- *Tip:* You can store and set automated reminders for ${name}'s upcoming vaccines directly in your **Petwrld Pet ID** tab!`;
  }

  if (q.includes('scratch') || q.includes('itch') || q.includes('flea') || q.includes('skin')) {
    return `🌿 **Skin & Itch Relief for ${name}**:
Constant scratching is commonly caused by fleas/ticks, seasonal environmental allergies, or food sensitivities.
1. Check ${name}'s coat near the tail base and belly for flea dirt or redness.
2. Ensure up-to-date monthly flea and tick prevention (available in our Petwrld E-commerce Pharmacy).
3. A soothing oatmeal shampoo or hypoallergenic bath can provide temporary soothing relief.`;
  }

  return `🐾 **Pet Care Recommendation for ${name}**:
Thank you for checking in on ${name}! A balanced diet tailored to their life stage, daily physical enrichment, clean dental hygiene, and regular veterinary checkups are the foundations of a happy, long pet life.
- You can log ${name}'s weight and medical milestones in **Pet ID**.
- For direct one-on-one video diagnostics, check out our **Online Vet Booking** section!`;
}

// Vite middleware & Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Petwrld server running on http://0.0.0.0:${PORT}`);
  });
}

start();
