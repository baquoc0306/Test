import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY missing');
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

async function callGemini(prompt: string): Promise<string> {
  const client = getClient();
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    try {
      const res = await client.models.generateContent({ model, contents: prompt });
      return res.text || '';
    } catch (e: any) {
      if (model === models[models.length - 1]) throw e;
    }
  }
  return '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { cell, lang } = req.body || {};
  if (!cell) return res.status(400).json({ error: 'Missing cell' });

  const movers = ['Learning Professional', 'Future Utility', 'Diamond in the Rough'];
  if (movers.includes(cell)) return res.json({ courses: [], source: 'static' });

  const shortList = [
    'AI for Everyone; Power Automate in Office',
    'Servant Leadership',
    'Communication & Presentation',
    'Coaching & Mentoring',
    'People Development / IDP & Skill Matrix',
    'Succession Planning & Talent Pipeline Review',
  ];

  const localFallback: Record<string, string[]> = {
    'Superstar': ['Succession Planning & Talent Pipeline Review', 'Servant Leadership'],
    'High Professional': ['Servant Leadership', 'Coaching & Mentoring'],
    'Seasoned Professional': ['AI for Everyone; Power Automate in Office', 'Coaching & Mentoring'],
    'Rising Star': ['Communication & Presentation', 'People Development / IDP & Skill Matrix'],
    'Valued Contributor': ['People Development / IDP & Skill Matrix', 'Communication & Presentation'],
    'Solid Professional': ['People Development / IDP & Skill Matrix', 'AI for Everyone; Power Automate in Office'],
  };

  try {
    const prompt = `Select exactly 2 courses from this list for employees in the "${cell}" 9-Box quadrant:
${JSON.stringify(shortList)}
Return ONLY a raw JSON array of 2 strings. No markdown, no explanation.`;
    const text = (await callGemini(prompt)).trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      const validated = parsed.filter((c: string) => shortList.includes(c));
      if (validated.length > 0) return res.json({ courses: validated, source: 'gemini' });
    }
  } catch { /* fallthrough */ }

  return res.json({ courses: localFallback[cell] || [], source: 'fallback' });
}