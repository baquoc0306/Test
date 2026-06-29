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

  const { dept, total, growers, growersPct, keepers, keepersPct, movers, moversPct, businessPhase, profile, lang } = req.body || {};
  if (!dept) return res.status(400).json({ error: 'Missing dept' });

  const langText = lang === 'VI' ? 'Vietnamese' : 'English';
  const prompt = `You are a friendly Business Advisor helping Department Heads understand their team's talent composition.
Use simple, plain language - NO complex HR jargon.

Department: ${dept}
- Total: ${total}, Growers (high-potential): ${growers} (${growersPct}%), Keepers (core): ${keepers} (${keepersPct}%), Movers (need support): ${movers} (${moversPct}%)
- Business Phase: ${businessPhase === 'FAST_GROWTH' ? 'Rapid Growth' : 'Stable Operation'}
- Team Profile: ${profile}

Respond in ${langText} with simple headings:
#### 💡 Team Overview
#### ⚠️ Key Observations  
#### 🎯 Practical Actions for Managers
Keep it concise, friendly, and actionable. Start directly with markdown.`;

  let insight = '';
  try {
    insight = await callGemini(prompt);
  } catch {
    insight = lang === 'VI'
      ? `#### 💡 Đánh giá đội ngũ ${dept}\nĐội ngũ ${total} người với **${growersPct}%** tiềm năng cao, **${keepersPct}%** nòng cốt vững vàng, **${moversPct}%** cần hỗ trợ thêm.\n\n#### ⚠️ Lưu ý thực tế\n- Tập trung phát triển nhóm Growers bằng cách giao thêm trách nhiệm\n- Hỗ trợ nhóm Movers với kế hoạch kèm cặp cụ thể\n\n#### 🎯 Gợi ý hành động\n1. Kèm cặp 1-1 cho nhóm Movers mỗi tuần\n2. Trao cơ hội dự án cho nhóm Growers\n3. Duy trì động lực cho nhóm Keepers nòng cốt`
      : `#### 💡 Team Overview for ${dept}\nTeam of **${total}** with **${growersPct}%** high-potential Growers, **${keepersPct}%** solid Keepers, **${moversPct}%** Movers needing support.\n\n#### ⚠️ Key Observations\n- Growers are ready for bigger responsibilities\n- Movers need structured coaching and support plans\n\n#### 🎯 Practical Actions\n1. Weekly 1-on-1 coaching for Movers\n2. Assign stretch projects to Growers\n3. Recognize and retain core Keepers`;
  }

  return res.json({ insight, fallback: false });
}