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

  const { courseId, courseName, competency, lang } = req.body || {};
  if (!courseName) return res.status(400).json({ error: 'Missing courseName' });

  const langText = lang === 'VI' ? 'Vietnamese' : 'English';
  const prompt = `You are a leading Corporate Training Specialist and L&D Program Director.
Generate a premium training syllabus for: "${courseName}" (ID: ${courseId || 'N/A'}, Competency: ${competency || 'General'}).
Language: ${langText}. Format: clean Markdown ~120-150 words total.
Sections:
- 🎯 Core Objectives (2 bullet points)
- 📚 Syllabus Structure (3 practical modules)
- ✨ Actionable Takeaways (1 key post-training action)
Return markdown directly, no preamble or wrapping.`;

  let syllabus = '';
  try {
    syllabus = await callGemini(prompt);
  } catch {
    syllabus = lang === 'VI'
      ? `#### 🎯 Mục Tiêu Đào Tạo\n- Phát triển toàn diện năng lực cốt lõi cho **${courseName}**\n- Chuẩn hóa kỹ năng hỗ trợ đo lường hiệu suất và tối ưu hóa thực thi\n\n#### 📚 Khung Chương Trình\n- **Chuyên đề 1:** Nhập môn & Tư duy nền tảng\n- **Chuyên đề 2:** Kỹ thuật vận dụng thực tiễn\n- **Chuyên đề 3:** Kiểm chuẩn & Đánh giá cải tiến\n\n#### ✨ Hành Động Sau Đào Tạo\n- Lập sơ đồ áp dụng thực tế (action plan) nộp cho L&D trong vòng 30 ngày`
      : `#### 🎯 Core Objectives\n- Develop key conceptual frameworks and operational skills for **${courseName}**\n- Standardize technical toolsets to monitor performance and optimize delivery\n\n#### 📚 Syllabus Structure\n- **Module 1:** Principles & Foundation\n- **Module 2:** Practical Implementation\n- **Module 3:** Impact Auditing & Optimization\n\n#### ✨ Actionable Takeaways\n- Complete a 30-day post-training execution checklist and submit to L&D supervisor`;
  }

  return res.json({ syllabus });
}