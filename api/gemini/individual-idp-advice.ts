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

const internalCourses = [
  'AI for Everyone; Power Automate in Office',
  'Servant Leadership',
  'Communication & Presentation',
  'Coaching & Mentoring',
  'People Development / IDP & Skill Matrix',
  'Succession Planning & Talent Pipeline Review',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { empName, title, department, lang, items } = req.body || {};
  const idpItems = Array.isArray(items) ? items : [];

  // Build fallback data
  const fallbackData = idpItems.slice(0, 3).map((item: any, i: number) => ({
    id: `idp_rec_${i}`,
    mappedGaps: item.trainingCategory || 'GENERAL',
    targetDuty: item.jobDuty || 'General Development',
    internalProgram: 'People Development / IDP & Skill Matrix',
    actionType: 'Department self follow-up',
    advice: `Participate in skills matrix review for "${item.jobDuty || 'your role'}".`,
    viAdvice: `Tham gia đánh giá ma trận kỹ năng cho "${item.jobDuty || 'vai trò của bạn'}".`,
    timeline: 'Q3/2026',
  }));
  while (fallbackData.length < 3) {
    fallbackData.push({
      id: `idp_rec_def_${fallbackData.length}`,
      mappedGaps: 'GENERAL SKILL GAPS',
      targetDuty: 'General Skills Enhancement',
      internalProgram: 'People Development / IDP & Skill Matrix',
      actionType: 'Department self follow-up',
      advice: 'Standard active self-learning and departmental coaching.',
      viAdvice: 'Tự đào tạo chủ động kết hợp kèm cặp chuyên môn theo hướng dẫn giám sát.',
      timeline: 'Q3/2026',
    });
  }

  try {
    const prompt = `You are an expert personal L&D Advisory Coach.
Generate exactly 3 personalized IDP recommendations for employee "${empName || 'Employee'}" (Title: "${title || 'Staff'}", Department: "${department || 'General'}").

Employee IDP items:
${JSON.stringify(idpItems.slice(0, 5), null, 2)}

ONLY use courses from this approved list:
${JSON.stringify(internalCourses, null, 2)}

Return ONLY a raw JSON array of exactly 3 objects. No markdown, no explanation.
Each object must have these exact keys:
- "id": string (e.g. "idp_rec_1")
- "mappedGaps": string (gap category)
- "targetDuty": string (job duty from employee items)
- "internalProgram": string (MUST match exactly from approved list)
- "actionType": string ("Add to Training Plan" or "Department self follow-up")
- "advice": string (English personalized guidance)
- "viAdvice": string (Vietnamese translation)
- "timeline": string (e.g. "Q3/2026")`;

    const text = (await callGemini(prompt)).trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length === 3) {
      const safe = parsed.map((item: any) => {
        const matched = internalCourses.find(c => c.toLowerCase() === (item.internalProgram || '').toLowerCase());
        item.internalProgram = matched || 'People Development / IDP & Skill Matrix';
        return item;
      });
      return res.json({ data: safe, source: 'gemini' });
    }
  } catch { /* fallthrough */ }

  return res.json({ data: fallbackData, source: 'fallback' });
}