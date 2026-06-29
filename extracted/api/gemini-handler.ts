import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is missing.');
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); })
           .catch(e => { clearTimeout(timer); reject(e); });
  });
}

async function callGeminiWithRetry<T>(fn: (model: string) => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: any;
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const model of models) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await withTimeout(fn(model), 20000);
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTransient = msg.includes('503') || msg.includes('429') || msg.includes('Timeout') || msg.includes('UNAVAILABLE');
        if (isTransient && attempt < retries) {
          await new Promise(r => setTimeout(r, delayMs * attempt));
        } else if (!isTransient) throw err;
      }
    }
  }
  throw lastError;
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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { endpoint, ...body } = req.body || {};

  try {
    const client = getGeminiClient();

    // ── COACHING ADVICE ──────────────────────────────────────────────────────
    if (endpoint === 'coaching-advice') {
      const { name, dept, cell, results, potential, group, lang } = body;
      if (!name || !cell) return res.status(400).json({ error: 'Missing name or cell.' });
      const langText = lang === 'VI' ? 'Vietnamese' : 'English';
      const prompt = `You are a highly experienced Executive Talent Coach and L&D Advisor.
Generate personalized L&D coaching recommendations for:
- Name: ${name}, Department: ${dept || 'General'}, 9-Box Cell: ${cell}
- Performance: ${results}, Potential: ${potential}, Group: ${group}

ONLY suggest courses from this list:
${JSON.stringify(internalCoursesList, null, 2)}

Respond in ${langText} using clean Markdown with these H4 sections:
1. 💡 Talent Overview
2. ⭐ Strengths & Opportunities (2 strengths, 2 development areas)
3. 🛣️ Strategic L&D Milestones (3 bullet action steps)
4. 📚 Targeted L&D Programs (exactly 2 courses from the list above with rationale)`;

      let advice = '';
      try {
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        advice = response.text || '';
      } catch {
        advice = lang === 'VI'
          ? `#### 💡 Đánh Giá Tài Năng\nNhân sự **${name}** tại ô **${cell}** thể hiện vai trò nòng cốt quan trọng.\n\n#### ⭐ Sức Mạnh & Cơ Hội\n* Năng lực chuyên môn ổn định\n* Cần phát triển thêm kỹ năng lãnh đạo\n\n#### 🛣️ Lộ Trình Phát Triển\n1. Tham gia dự án liên phòng ban\n2. Kèm cặp đồng nghiệp mới\n3. Cải tiến quy trình làm việc\n\n#### 📚 Đề Xuất Khóa Học\n1. **Servant Leadership** - Phát triển kỹ năng lãnh đạo\n2. **Coaching & Mentoring** - Hỗ trợ đồng nghiệp hiệu quả`
          : `#### 💡 Talent Overview\n**${name}** in the **${cell}** box demonstrates strong core value.\n\n#### ⭐ Strengths & Opportunities\n* Solid domain expertise\n* Leadership skills need development\n\n#### 🛣️ Strategic Milestones\n1. Lead cross-functional project\n2. Mentor junior colleagues\n3. Optimize workflow processes\n\n#### 📚 Targeted Programs\n1. **Servant Leadership** - Build leadership capability\n2. **Coaching & Mentoring** - Support team development`;
      }
      return res.json({ advice });
    }

    // ── COHORT RECS ──────────────────────────────────────────────────────────
    if (endpoint === 'cohort-recs') {
      const { cell, lang } = body;
      if (!cell) return res.status(400).json({ error: 'Missing cell.' });
      const movers = ['Learning Professional', 'Future Utility', 'Diamond in the Rough'];
      if (movers.includes(cell)) return res.json({ courses: [], source: 'static' });

      const localFallback: Record<string, string[]> = {
        'Superstar': ['Succession Planning & Talent Pipeline Review', 'Servant Leadership'],
        'High Professional': ['Servant Leadership', 'Coaching & Mentoring'],
        'Seasoned Professional': ['AI for Everyone; Power Automate in Office', 'Coaching & Mentoring'],
        'Rising Star': ['Communication & Presentation', 'People Development / IDP & Skill Matrix'],
        'Valued Contributor': ['People Development / IDP & Skill Matrix', 'Communication & Presentation'],
        'Solid Professional': ['People Development / IDP & Skill Matrix', 'AI for Everyone; Power Automate in Office'],
      };

      try {
        const shortList = ['AI for Everyone; Power Automate in Office', 'Servant Leadership', 'Communication & Presentation', 'Coaching & Mentoring', 'People Development / IDP & Skill Matrix', 'Succession Planning & Talent Pipeline Review'];
        const prompt = `Select exactly 2 courses from this list for employees in the "${cell}" 9-Box quadrant:
${JSON.stringify(shortList)}
Return ONLY a raw JSON array of 2 strings. No markdown, no explanation.`;
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        let text = (response.text || '').trim().replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.filter((c: string) => shortList.includes(c));
          if (validated.length > 0) return res.json({ courses: validated, source: 'gemini' });
        }
      } catch { /* fall through */ }
      return res.json({ courses: localFallback[cell] || [], source: 'fallback' });
    }

    // ── COURSE SYLLABUS ───────────────────────────────────────────────────────
    if (endpoint === 'course-syllabus') {
      const { courseName, competency, lang } = body;
      if (!courseName) return res.status(400).json({ error: 'Missing courseName.' });
      const langText = lang === 'VI' ? 'Vietnamese' : 'English';
      const prompt = `Generate a concise corporate training syllabus for "${courseName}" (competency: ${competency || 'General'}).
Language: ${langText}. Format: clean Markdown ~120-150 words.
Sections: 🎯 Core Objectives (2 bullets), 📚 Syllabus Structure (3 modules), ✨ Actionable Takeaways (1 item).
Return markdown directly, no preamble.`;

      let syllabus = '';
      try {
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        syllabus = response.text || '';
      } catch {
        syllabus = `#### 🎯 Core Objectives\n- Develop key skills for **${courseName}**\n- Apply learning to daily work tasks\n\n#### 📚 Syllabus Structure\n- **Module 1:** Foundations & Principles\n- **Module 2:** Practical Application\n- **Module 3:** Assessment & Improvement\n\n#### ✨ Actionable Takeaways\n- Submit a 30-day action plan to L&D supervisor`;
      }
      return res.json({ syllabus });
    }

    // ── INDIVIDUAL IDP ADVICE ─────────────────────────────────────────────────
    if (endpoint === 'individual-idp-advice') {
      const { empName, title, department, lang, items } = body;
      const idpItems = Array.isArray(items) ? items : [];
      const internalCourses = internalCoursesList.slice(0, 6);

      const fallbackData = idpItems.slice(0, 3).map((item: any, i: number) => ({
        id: `idp_rec_${i}`,
        mappedGaps: item.trainingCategory || 'GENERAL',
        targetDuty: item.jobDuty || 'General Development',
        internalProgram: 'People Development / IDP & Skill Matrix',
        actionType: 'Department self follow-up',
        advice: `Participate in skills matrix review for ${item.jobDuty || 'your role'}.`,
        viAdvice: `Tham gia đánh giá ma trận kỹ năng cho ${item.jobDuty || 'vai trò của bạn'}.`,
        timeline: 'Q3/2026',
      }));
      while (fallbackData.length < 3) {
        fallbackData.push({ id: `idp_rec_def_${fallbackData.length}`, mappedGaps: 'GENERAL', targetDuty: 'General Enhancement', internalProgram: 'People Development / IDP & Skill Matrix', actionType: 'Department self follow-up', advice: 'Standard self-learning and coaching.', viAdvice: 'Tự đào tạo và kèm cặp chuyên môn.', timeline: 'Q3/2026' });
      }

      try {
        const prompt = `Generate exactly 3 personalized IDP recommendations for employee "${empName}" (${title}, ${department}).
IDP items: ${JSON.stringify(idpItems.slice(0, 5))}
Approved courses ONLY: ${JSON.stringify(internalCourses)}
Return ONLY a raw JSON array of 3 objects with keys: id, mappedGaps, targetDuty, internalProgram, actionType, advice, viAdvice, timeline.`;
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        let text = (response.text || '').trim().replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length === 3) {
          const safe = parsed.map((item: any) => {
            const matched = internalCourses.find(c => c.toLowerCase() === (item.internalProgram || '').toLowerCase());
            item.internalProgram = matched || 'People Development / IDP & Skill Matrix';
            return item;
          });
          return res.json({ data: safe, source: 'gemini' });
        }
      } catch { /* fall through */ }
      return res.json({ data: fallbackData, source: 'fallback' });
    }

    // ── CAREER PREDICTION ─────────────────────────────────────────────────────
    if (endpoint === 'career-prediction') {
      const { name, dept, cell, history, idpProgress, lang } = body;
      if (!name || !cell) return res.status(400).json({ error: 'Missing name or cell.' });
      const langText = lang === 'VI' ? 'Vietnamese' : 'English';
      const isGrower = ['Superstar', 'High Professional', 'Rising Star'].includes(cell);

      try {
        const prompt = `Predict career progression for "${name}" (${dept}, 9-Box: ${cell}, IDP: ${idpProgress}%).
Return ONLY raw JSON with keys: targetRole, targetDept, suitabilityMatch, readiness, rationale (in ${langText}).`;
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        let text = (response.text || '').trim().replace(/```json|```/g, '').trim();
        return res.json({ prediction: JSON.parse(text) });
      } catch {
        return res.json({
          prediction: {
            targetRole: isGrower ? 'Assistant Department Manager' : 'Senior Specialist',
            targetDept: dept || 'Operations',
            suitabilityMatch: isGrower ? '95%' : '88%',
            readiness: isGrower ? 'Ready Now' : '6-12 Months',
            rationale: lang === 'VI'
              ? `Dựa trên vị trí ${cell} và tiến độ IDP ${idpProgress}%, nhân sự thể hiện cam kết cao.`
              : `Based on ${cell} placement and ${idpProgress}% IDP progress, strong commitment shown.`,
          },
          fallback: true,
        });
      }
    }

    // ── PEER MENTORS ──────────────────────────────────────────────────────────
    if (endpoint === 'peer-mentors') {
      const { mentee, superstars, lang } = body;
      if (!mentee || !Array.isArray(superstars)) return res.status(400).json({ error: 'Missing mentee or superstars.' });
      const langText = lang === 'VI' ? 'Vietnamese' : 'English';

      try {
        const prompt = `Suggest 1-2 mentors from Superstars list for mentee "${mentee.name}" (${mentee.dept}, ${mentee.cell}).
Superstars: ${JSON.stringify(superstars.slice(0, 10))}
Write in ${langText} using clean Markdown. Include rationale and 2 collaboration activities.`;
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        return res.json({ advice: response.text, fallback: false });
      } catch {
        const mentor = superstars.find((s: any) => s.dept === mentee.dept) || superstars[0] || { name: 'Senior Leader', dept: 'Operations' };
        return res.json({
          advice: lang === 'VI'
            ? `### 👥 Đề Xuất Cặp Đôi Kèm Cặp\n\n#### 👔 Cố Vấn: ${mentor.name} (${mentor.dept})\n* Phù hợp về chuyên môn và kinh nghiệm\n\n#### 🎯 Kế Hoạch Hành Động\n1. **Shadowing hàng tuần** - Quan sát phong cách làm việc\n2. **Review IDP hàng tháng** - Đánh giá tiến độ phát triển`
            : `### 👥 Peer Mentor Recommendation\n\n#### 👔 Suggested Mentor: ${mentor.name} (${mentor.dept})\n* Strong domain alignment and experience match\n\n#### 🎯 Action Plan\n1. **Weekly shadowing** - Observe work style and decisions\n2. **Monthly IDP review** - Track development progress`,
          fallback: true,
        });
      }
    }

    // ── DEPT INSIGHT ──────────────────────────────────────────────────────────
    if (endpoint === 'dept-insight') {
      const { dept, total, growers, growersPct, keepers, keepersPct, movers, moversPct, businessPhase, profile, lang } = body;
      if (!dept) return res.status(400).json({ error: 'Missing dept.' });
      const langText = lang === 'VI' ? 'Vietnamese' : 'English';

      try {
        const prompt = `Provide a simple, friendly team analysis for department "${dept}":
- Total: ${total}, Growers: ${growers} (${growersPct}%), Keepers: ${keepers} (${keepersPct}%), Movers: ${movers} (${moversPct}%)
- Business Phase: ${businessPhase}, Profile: ${profile}
Write in plain ${langText} for non-HR managers. Use simple language, no jargon.
Sections: 💡 Team Overview, ⚠️ Key Observations, 🎯 Practical Actions.`;
        const response = await callGeminiWithRetry(m => client.models.generateContent({ model: m, contents: prompt }));
        return res.json({ insight: response.text, fallback: false });
      } catch {
        return res.json({
          insight: lang === 'VI'
            ? `#### 💡 Đánh giá đội ngũ ${dept}\nĐội ngũ ${total} người với ${growersPct}% tiềm năng cao, ${keepersPct}% nòng cốt, ${moversPct}% cần hỗ trợ.\n\n#### ⚠️ Lưu ý\nTập trung phát triển nhóm Growers và hỗ trợ nhóm Movers.\n\n#### 🎯 Hành động\n1. Kèm cặp nhóm Movers\n2. Trao cơ hội cho nhóm Growers`
            : `#### 💡 Team Overview for ${dept}\nTeam of ${total} with ${growersPct}% high-potential, ${keepersPct}% core, ${moversPct}% needing support.\n\n#### ⚠️ Key Observations\nFocus on developing Growers and supporting Movers.\n\n#### 🎯 Practical Actions\n1. Coach Movers with structured plans\n2. Give Growers stretch assignments`,
          fallback: true,
        });
      }
    }

    return res.status(400).json({ error: `Unknown endpoint: ${endpoint}` });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}