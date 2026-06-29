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

const internalCoursesList = [
  'AI for Everyone; Power Automate in Office',
  'Servant Leadership',
  'Communication & Presentation',
  'Coaching & Mentoring',
  'People Development / IDP & Skill Matrix',
  'Succession Planning & Talent Pipeline Review',
  'Business Acumen & Decision Making',
  'Process Improvement / Compliance Follow-up',
  'Workforce / Ramp Planning Follow-up',
  'Function-specific Development Plan',
  'Employee Relations Follow-up',
  'Finance / Cost Management Follow-up',
  'Talent Acquisition Follow-up',
  'Training Capability Follow-up',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { name, dept, cell, results, potential, group, lang } = req.body || {};
  if (!name || !cell) return res.status(400).json({ error: 'Missing name or cell' });

  const langText = lang === 'VI' ? 'Vietnamese' : 'English';
  const prompt = `You are a highly experienced Executive Talent Coach and L&D Advisor.
Generate personalized L&D coaching recommendations for:
- Name: ${name}, Department: ${dept || 'General'}, 9-Box Cell: ${cell}
- Performance: ${results}, Potential: ${potential}, Group: ${group}

ONLY suggest courses from this approved list:
${JSON.stringify(internalCoursesList, null, 2)}

Respond entirely in ${langText} using clean Markdown with these H4 sections:
1. 💡 Talent Overview
2. ⭐ Strengths & Opportunities (2 strengths, 2 development areas)
3. 🛣️ Strategic L&D Milestones (3 bullet action steps)
4. 📚 Targeted L&D Programs (exactly 2 courses from the approved list with rationale)
Return markdown directly, no preamble.`;

  let advice = '';
  try {
    advice = await callGemini(prompt);
  } catch {
    advice = lang === 'VI'
      ? `#### 💡 Đánh Giá Tài Năng\nNhân sự **${name}** tại ô **${cell}** thể hiện vai trò nòng cốt quan trọng trong bộ phận **${dept || 'Sản Xuất'}**.\n\n#### ⭐ Sức Mạnh & Cơ Hội\n* **Sức mạnh:** Năng lực chuyên môn ổn định, được đồng nghiệp tin tưởng\n* **Cơ hội:** Cần phát triển thêm kỹ năng lãnh đạo và tư duy hệ thống\n\n#### 🛣️ Lộ Trình Phát Triển\n1. Tham gia dự án liên phòng ban để mở rộng tầm nhìn\n2. Kèm cặp đồng nghiệp mới trong bộ phận\n3. Cải tiến quy trình làm việc hàng ngày\n\n#### 📚 Đề Xuất Khóa Học\n1. **Servant Leadership** - Phát triển kỹ năng lãnh đạo phục vụ\n2. **Coaching & Mentoring** - Hỗ trợ đồng nghiệp phát triển hiệu quả`
      : `#### 💡 Talent Overview\n**${name}** in the **${cell}** box demonstrates strong core value in **${dept || 'Operations'}**.\n\n#### ⭐ Strengths & Opportunities\n* **Strength:** Solid domain expertise and high peer trust\n* **Opportunity:** Leadership skills and systems thinking need development\n\n#### 🛣️ Strategic Milestones\n1. Lead a cross-functional project to broaden perspective\n2. Mentor junior colleagues in the department\n3. Optimize daily workflow processes\n\n#### 📚 Targeted Programs\n1. **Servant Leadership** - Build empathetic leadership capability\n2. **Coaching & Mentoring** - Support team development effectively`;
  }

  return res.json({ advice });
}