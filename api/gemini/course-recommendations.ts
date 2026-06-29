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

const approvedCourses = [
  { id: 'c1', name: 'AI for Everyone; Power Automate in Office', viName: 'AI cho mọi người; Power Automate trong Văn phòng', competency: 'Digital Literacy', priority: 1 },
  { id: 'c2', name: 'Servant Leadership', viName: 'Lãnh đạo Phục vụ', competency: 'Leadership', priority: 1 },
  { id: 'c3', name: 'Communication & Presentation', viName: 'Giao tiếp & Thuyết trình', competency: 'Soft Skills', priority: 2 },
  { id: 'c4', name: 'Coaching & Mentoring', viName: 'Kèm cặp & Hướng dẫn', competency: 'People Development', priority: 2 },
  { id: 'c5', name: 'People Development / IDP & Skill Matrix', viName: 'Phát triển Nhân sự / IDP & Ma trận Kỹ năng', competency: 'HR Management', priority: 1 },
  { id: 'c6', name: 'Succession Planning & Talent Pipeline Review', viName: 'Hoạch định Kế thừa & Đánh giá Nhân tài', competency: 'Strategic HR', priority: 2 },
  { id: 'c7', name: 'Business Acumen & Decision Making', viName: 'Tư duy Kinh doanh & Ra quyết định', competency: 'Business Skills', priority: 3 },
  { id: 'c8', name: 'Process Improvement / Compliance Follow-up', viName: 'Cải tiến Quy trình / Tuân thủ', competency: 'Operations', priority: 3 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { dept, lang } = req.body || {};
  const langText = lang === 'VI' ? 'Vietnamese' : 'English';

  try {
    const prompt = `You are a Corporate L&D Director recommending training courses for the "${dept || 'All'}" department.
From this approved course list, select the top 4 most relevant courses and return them with brief rationale:
${JSON.stringify(approvedCourses, null, 2)}

Return ONLY a raw JSON array of 4 objects. No markdown, no explanation.
Each object must have: id, name, viName, competency, priority (number 1-3), rationale (string in ${langText}), viRationale (string in Vietnamese).`;

    const text = (await callGemini(prompt)).trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return res.json({ data: parsed, source: 'gemini' });
    }
  } catch { /* fallthrough */ }

  // Fallback: return top 4 courses with static rationale
  const fallback = approvedCourses.slice(0, 4).map(c => ({
    ...c,
    rationale: `Recommended for ${dept || 'all departments'} to strengthen core competencies.`,
    viRationale: `Được đề xuất cho ${dept || 'tất cả bộ phận'} để củng cố năng lực cốt lõi.`,
  }));
  return res.json({ data: fallback, source: 'fallback' });
}