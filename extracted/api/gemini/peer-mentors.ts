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

  const { mentee, superstars, lang } = req.body || {};
  if (!mentee || !Array.isArray(superstars)) return res.status(400).json({ error: 'Missing mentee or superstars' });

  const langText = lang === 'VI' ? 'Vietnamese' : 'English';
  const prompt = `You are an expert L&D Director and Executive Coach.
Suggest 1-2 mentors from the Superstar cohort for mentee "${mentee.name}" (${mentee.dept}, 9-Box: ${mentee.cell}, Performance: ${mentee.results}, Potential: ${mentee.potential}).

Available Superstar mentors:
${JSON.stringify(superstars.slice(0, 10), null, 2)}

Instructions:
1. Pick 1-2 best matching mentors (same or different dept)
2. Explain why they fit
3. Outline 2 concrete collaboration activities
4. Write entirely in ${langText} using clean Markdown only (no HTML)`;

  try {
    const advice = await callGemini(prompt);
    return res.json({ advice, fallback: false });
  } catch {
    const filtered = superstars.filter((s: any) => s.name?.toLowerCase() !== mentee.name?.toLowerCase());
    const mentor = filtered.find((s: any) => s.dept === mentee.dept) || filtered[0] || { name: 'Senior Leader', dept: 'Operations' };

    const advice = lang === 'VI'
      ? `### 👥 Đề Xuất Cặp Đôi Kèm Cặp\n\nChúng tôi đã kết nối **${mentee.name}** với Cố vấn xuất sắc từ nhóm **Superstar**:\n\n#### 👔 Cố Vấn Đề Xuất: ${mentor.name} (Bộ phận: ${mentor.dept})\n* **Lý do ghép cặp:** ${mentor.dept === mentee.dept ? `Cùng bộ phận **${mentee.dept}** - chia sẻ chuyên môn kỹ thuật thực tế và giải quyết nút thắt vận hành tại chỗ.` : `Kết nối liên bộ phận **${mentee.dept}** ↔ **${mentor.dept}** - phát triển tư duy hệ thống và tầm nhìn liên thông.`}\n\n#### 🎯 Kế Hoạch Hành Động\n1. **Shadowing hàng tuần (30 ngày đầu):** Quan sát phong cách quản lý và ra quyết định của Cố vấn\n2. **Review IDP hàng tháng (45 phút):** Đánh giá tiến độ phát triển và điều chỉnh năng lực`
      : `### 👥 Peer Mentor Recommendation\n\nWe matched **${mentee.name}** with a top mentor from the **Superstar** cohort:\n\n#### 👔 Suggested Mentor: ${mentor.name} (Department: ${mentor.dept})\n* **Rationale:** ${mentor.dept === mentee.dept ? `Same **${mentee.dept}** department - enables direct technical knowledge transfer and operational problem-solving.` : `Cross-functional pairing **${mentee.dept}** ↔ **${mentor.dept}** - builds systems thinking and enterprise-wide perspective.`}\n\n#### 🎯 Collaboration Action Plan\n1. **Weekly shadowing (first 30 days):** Observe mentor's project management and decision-making style\n2. **Monthly IDP review (45 min):** Track development progress and adjust learning goals`;

    return res.json({ advice, fallback: true });
  }
}