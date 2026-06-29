import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy-initialization of Gemini SDK client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is requested but missing. Please configure it in your Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Global execution timeout helper for raw API model calls to guard against network timeouts
function withTimeout<T>(promise: Promise<T>, ms: number = 20000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`API Timeout after ${ms}ms`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper to retry Gemini calls on transient errors with backoff
async function callGeminiWithRetry<T>(
  fn: (modelName: string) => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  
  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await withTimeout(fn(model), 20000);
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.includes("Timeout") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("demand");

        if (isTransient) {
          if (attempt < retries) {
            console.log(`[Gemini Retry] Model ${model}, Attempt ${attempt} failed with transient error: ${errMsg.substring(0, 80)}. Retrying in ${delayMs * attempt}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
            continue;
          } else {
            console.log(`[Gemini Model Fallback] Model ${model} exhausted retries. Trying next available model...`);
          }
        } else {
          throw err;
        }
      }
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser for API requests
  app.use(express.json());

  // API: Get Personalized L&D coaching recommendations via Gemini 3.5-flash
  app.post("/api/gemini/coaching-advice", async (req, res) => {
    try {
      const { name, dept, cell, results, potential, group, lang } = req.body;

      if (!name || !cell) {
        return res.status(400).json({ error: "Missing required talent workspace fields (name, cell)." });
      }

      const client = getGeminiClient();

      const langText = lang === "VI" ? "Vietnamese" : "English";

      const internalCoursesList = [
        "AI for Everyone; Power Automate in Office",
        "Servant Leadership",
        "Communication & Presentation",
        "Coaching & Mentoring",
        "People Development / IDP & Skill Matrix",
        "Succession Planning & Talent Pipeline Review",
        "Business Acumen & Decision Making",
        "Process Improvement / Compliance Follow-up",
        "Workforce / Ramp Planning Follow-up",
        "Function-specific Development Plan",
        "Employee Relations Follow-up",
        "Finance / Cost Management Follow-up",
        "Talent Acquisition Follow-up",
        "Training Capability Follow-up"
      ];

      // Build a rich structured prompt for Gemini 3.5 Flash
      const prompt = `
You are a highly experienced Executive Talent Coach and Learning & Development (L&D) Advisor.
Your objective is to generate personalized, inspiring, and actionable L&D coaching recommendations for an employee on their Talent Review & Succession Planning profile.

Employee Information:
- Name: ${name}
- Department: ${dept || "General Production Site"}
- 9-Box Cell: ${cell}
- Performance Level: ${results || "No current assessment"}
- Potential Level: ${potential || "No current assessment"}
- Strategic Grouping: ${group || "Keepers / Growers / Movers"}

IMPORTANT RULES: 
- You MUST only suggest or recommend targeted training courses/programs that are strictly present in our L&D Planned Courses Pool. Any outside, fictional, online, or third-party external courses are FORBIDDEN.
- The ONLY planned L&D courses in our corporate system are:
${JSON.stringify(internalCoursesList, null, 2)}

Please structure your response carefully in clean Markdown. The language of the final output MUST be entirely in ${langText}.

Include the following sections (use clear H4 headers):

1. **💡 Đánh Giá Tài Năng Lực (Talent Overview)**:
   A summary of what this 9-Box placement means for ${name}'s current professional value and velocity. Give a brief, personalized and highly positive, professional overview.

2. **⭐ Sức Mạnh & Cơ Hội (Strengths & Opportunities)**:
   Provide 2 core strengths shown by their placement, and 2 direct development areas where they can improve (tailor this to the specific 9-Box quadrant cell, e.g. "Rising Star" vs "Seasoned Professional").

3. **🛣️ Lộ Trình Phát Triển Chiến Lược (Strategic L&D Milestones)**:
   Draft 3 concrete action steps in bullet format. Make these steps challenging, realistic, and tailored to their Group context (Growers need fast leadership exposure, Keepers need specialized technical depth, Movers need core performance stabilization plans).

4. **📚 Đề Xuất Khóa Học Trọng Tâm (Targeted L&D Programs)**:
   Suggest exactly 2 specific training program recommendations from our L&D Planned Courses Pool listed above. For each of the 2, write the exact title of the course from the pool and provide a brief 2-sentence rationale on how it solves their gaps or fits their 9-box cell status.

Ensure a highly professional, encouraging, objective, and executive-ready tone that inspires the manager watching over this profile to take positive action! Return the markdown directly. No preamble or wrapping notes.
`;

      let advice = "";
      try {
        const response = await callGeminiWithRetry((modelName) =>
          client.models.generateContent({
            model: modelName,
            contents: prompt,
          })
        );
        advice = response.text || "";
      } catch (gemErr: any) {
        console.log(`[Gemini Fallback] Coaching advice loaded via heuristic fallback. Status: ${String(gemErr?.message || gemErr).substring(0, 80)}`);
        advice = lang === "VI"
          ? `#### 💡 Đánh Giá Tài Năng Lực (Talent Overview)
Phát triển vượt bậc dựa trên khung đánh giá 9-Box cho nhân sự **${name}**. Vị trí nhóm **${cell}** phản ánh vai trò nòng cốt quan trọng của bạn trong bộ phận **${dept || "Sản Xuất"}**.

#### ⭐ Sức Mạnh & Cơ Hội (Strengths & Opportunities)
* **Sức mạnh:** Có độ nhạy bén nghiệp vụ cao, năng lực hoạt động ổn định và có sự tín nhiệm cao từ đồng nghiệp xung quanh.
* **Cơ hội:** Cần bồi dưỡng sâu hơn về tư duy quản trị hệ thống và năng lực giải quyết xung đột/điều phối chéo.

#### 🛣️ Lộ Trình Phát Triển Chiến Lược (Strategic L&D Milestones)
1. **Mở rộng vai trò hỗ trợ chéo:** Đảm nhận điều phối thêm ít nhất 1 dự án cải tiến hiệu suất trong quý tới.
2. **Kèm cặp đồng nghiệp mới:** Chia sẻ SOP chuyên môn thông qua các buổi hướng dẫn ngắn định kỳ của bộ phận.
3. **Thúc đẩy tư duy cải tiến:** Liên tục cải tiến chuẩn hóa các khâu làm việc hao phí thời gian hành chính.

#### 📚 Đề Xuất Khóa Học Trọng Tâm (Targeted L&D Programs)
1. **Servant Leadership**: Hỗ trợ tăng cường sự thấu cảm, thúc đẩy sự chuyển giao kiến thức cho câu lạc bộ hạt nhân cốt cán.
2. **Coaching & Mentoring**: Trang bị bộ khung hướng dẫn kèm cặp hiệu quả để trực tiếp bồi dưỡng thế hệ kế cận.`
          : `#### 💡 Talent Overview
Outstanding progress demonstrated under the 9-Box framework for **${name}**. This position as a **${cell}** reflects your critical value within the **${dept || "Operations"}** department.

#### ⭐ Strengths & Opportunities
* **Strength:** Excellent business acumen, reliable output quality, and a highly regarded reputation among regional peers.
* **Opportunity:** Needs targeted upskilling in proactive system design and structured departmental conflict handling.

#### 🛣️ Strategic L&D Milestones
1. **Cross-functional contribution:** Lead or facilitate at least one operation refinement project in the upcoming business quarter.
2. **Mentoring involvement:** Systematically transfer operational core practices to newly onboarded colleagues.
3. **Continuous betterment:** Aim to optimize administrative workflow gaps within daily operational tasks.

#### 📚 Targeted L&D Programs
1. **Servant Leadership**: Helps cultivate empathetic guidance and strengthens team motivation.
2. **Coaching & Mentoring**: Equips you with practical supervisory framework structures to support junior members.`;
      }
      
      return res.json({ advice });
    } catch (error: any) {
      console.error("Gemini Coaching API Error:", error);
      return res.status(500).json({
        error: error.message || "Intermittent server error processing L&D recommendation with Gemini API.",
      });
    }
  });

  // API: Get dynamic AI-generated development recommendations for a 9-box cohort cell
  app.post("/api/gemini/cohort-recs", async (req, res) => {
    try {
      const { cell, lang } = req.body;
      if (!cell) {
        return res.status(400).json({ error: "Missing required cell." });
      }

      const movers = ["Learning Professional", "Future Utility", "Diamond in the Rough"];
      if (movers.includes(cell)) {
        return res.json({ courses: [], source: "static" });
      }

      const internalCoursesList = [
        "AI for Everyone; Power Automate in Office",
        "Servant Leadership",
        "Communication & Presentation",
        "Coaching & Mentoring",
        "People Development / IDP & Skill Matrix",
        "Succession Planning & Talent Pipeline Review"
      ];

      // fallback list of suggestions depending on cell just in case API fails
      const localFallback: Record<string, string[]> = {
        'Superstar': ["Succession Planning & Talent Pipeline Review", "Servant Leadership"],
        'High Professional': ["Servant Leadership", "Coaching & Mentoring"],
        'Seasoned Professional': ["AI for Everyone; Power Automate in Office", "Coaching & Mentoring"],
        'Rising Star': ["Communication & Presentation", "People Development / IDP & Skill Matrix"],
        'Valued Contributor': ["People Development / IDP & Skill Matrix", "Communication & Presentation"],
        'Solid Professional': ["People Development / IDP & Skill Matrix", "AI for Everyone; Power Automate in Office"]
      };

      try {
        const client = getGeminiClient();
        const prompt = `
You are an expert Corporate L&D Director.
Your task is to select exactly 2 distinct, highly relevant development training courses from our approved list for employees in the "${cell}" 9-Box quadrant.

THE ONLY APPROVED INTERNAL COURSES ARE STRICTLY:
${JSON.stringify(internalCoursesList, null, 2)}

Please output the response strictly as a raw JSON array of strings containing exactly 2 course titles from the approved list above.
DO NOT include any markdown packaging like \`\`\`json, notes, or additional introductory sentences. Return ONLY the raw JSON array.

Validate your output JSON compliance carefully. Output the raw JSON array now.
`;

        const response = await callGeminiWithRetry((modelName) =>
          client.models.generateContent({
            model: modelName,
            contents: prompt,
          })
        );

        const rawText = response.text?.trim() || "";
        let cleanText = rawText;
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith("```")) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();

        const aiData = JSON.parse(cleanText);
        if (Array.isArray(aiData) && aiData.length > 0) {
          // Verify that they are strictly inside our internal list
          const validated = aiData
            .map((item: any) => {
              const matched = internalCoursesList.find(c => c.toLowerCase() === String(item).trim().toLowerCase());
              return matched || null;
            })
            .filter((c): c is string => c !== null);

          if (validated.length > 0) {
            return res.json({ courses: validated, source: "gemini" });
          }
        }
      } catch (gem_err: any) {
        console.log(`[Gemini Fallback] Cohort suggestions fallback activated. Status: ${String(gem_err?.message || gem_err).substring(0, 80)}`);
      }

      return res.json({ courses: localFallback[cell] || [], source: "fallback" });
    } catch (err: any) {
      console.log(`[Gemini Fallback] cohort-recs service fallback activated. Status: ${String(err?.message || err).substring(0, 80)}`);
      const localFallback: Record<string, string[]> = {
        'Superstar': ["Succession Planning & Talent Pipeline Review", "Servant Leadership"],
        'High Professional': ["Servant Leadership", "Coaching & Mentoring"],
        'Seasoned Professional': ["AI for Everyone; Power Automate in Office", "Coaching & Mentoring"],
        'Rising Star': ["Communication & Presentation", "People Development / IDP & Skill Matrix"],
        'Valued Contributor': ["People Development / IDP & Skill Matrix", "Communication & Presentation"],
        'Solid Professional': ["People Development / IDP & Skill Matrix", "AI for Everyone; Power Automate in Office"]
      };
      return res.json({ courses: localFallback[req.body?.cell] || [], source: "fallback" });
    }
  });

  // API: Get AI course curriculum proposals via Gemini 3.5-flash
  app.post("/api/gemini/course-syllabus", async (req, res) => {
    try {
      const { courseId, courseName, competency, lang } = req.body;

      if (!courseName) {
        return res.status(400).json({ error: "Missing required courseName." });
      }

      const client = getGeminiClient();

      const langText = lang === "VI" ? "Vietnamese" : "English";

      const prompt = `
You are a leading Corporate Training Specialist and L&D Program Director.
Your task is to generate a premium, high-impact training syllabus outline and curriculum objectives for a corporate development course.

Course Details:
- Title: ${courseName} (ID: ${courseId || 'N/A'})
- Core Competency Focused: ${competency || 'General Professional competency'}

Language requirement: Please write the entire response in ${langText}.
Format: Clear, highly readable styled Markdown, beautifully presented.

Please outline:
- **🎯 Mục Tiêu Đào Tạo (Core Objectives)**: (2 items, bulleted)
- **📚 Khung Chương Trình (Syllabus Structure)**: (3 main modules, highly practical and modern)
- **✨ Hành Động Sau Đào Tạo (Actionable Takeaways)**: 1 key post-training action item

Keep the output concise (about 120-150 words total) so it fits beautifully inside a modal container. Return the markdown directly with no preambles or wrap-around symbols.
`;

      let syllabus = "";
      try {
        const response = await callGeminiWithRetry((modelName) =>
          client.models.generateContent({
            model: modelName,
            contents: prompt,
          })
        );
        syllabus = response.text || "";
      } catch (gemErr: any) {
        console.log(`[Gemini Fallback] Syllabus generation loaded via fallback. Status: ${String(gemErr?.message || gemErr).substring(0, 80)}`);
        syllabus = lang === "VI" 
          ? `#### 🎯 Mục Tiêu Đào Tạo (Core Objectives)
- Phát triển toàn diện năng lực tư duy cốt lõi và phương pháp ứng dụng nghiệp vụ thực tế cho hành trình **${courseName}**.
- Chuẩn hóa bộ kỹ năng hạt nhân hỗ trợ đo lường hiệu suất và tối ưu hóa thời gian thực thi.

#### 📚 Khung Chương Trình (Syllabus Structure)
- **Chuyên đề 1: Nhập môn & Tư duy nền tảng** - Định vị vai trò cá nhân và xây dựng mục tiêu hành động.
- **Chuyên đề 2: Kỹ thuật vận dụng thực tiễn** - Nghiên cứu tình huống (case studies) và giải bài toán tình huống doanh nghiệp.
- **Chuyên đề 3: Kiểm chuẩn & Đánh giá cải tiến** - Thực hành đo lường chất lượng đầu ra sau chu kỳ bồi dưỡng chuyên biệt.

#### ✨ Hành Động Sau Đào Tạo (Actionable Takeaways)
- Lập sơ đồ áp dụng thực tế (action plan) nộp cho L&D giám sát kết quả thực thi công việc trong vòng 30 ngày.`
          : `#### 🎯 Core Objectives
- Comprehensively develop core conceptual frameworks and operational application skills for **${courseName}**.
- Standardize key technical toolsets to monitor performance metrics and optimize delivery workflows.

#### 📚 Syllabus Structure
- **Module 1: Principles and Foundation** - Align personal responsibilities to macro-level business objectives.
- **Module 2: Practical Implementation** - Analyze scenario-based group studies and local department problem solving.
- **Module 3: Impact Auditing & Optimization** - Practice qualitative result tracking and operational feedback cycles.

#### ✨ Actionable Takeaways
- Complete a 30-day post-training execution checklist and submit it to the L&D supervisor to verify transfer of learning.`;
      }
      
      return res.json({ syllabus });
    } catch (error: any) {
      console.log(`[Gemini Fallback] course-syllabus top-level fallback activated. Status: ${String(error?.message || error).substring(0, 80)}`);
      const courseName = req.body?.courseName || "Training Course";
      const lang = req.body?.lang || "VI";
      const fallbackSyllabus = lang === "VI" 
        ? `#### 🎯 Mục Tiêu Đào Tạo (Core Objectives)
- Phát triển toàn diện năng lực tư duy cốt lõi và phương pháp ứng dụng nghiệp vụ thực tế cho hành trình **${courseName}**.
- Chuẩn hóa bộ kỹ năng hạt nhân hỗ trợ đo lường hiệu suất và tối ưu hóa thời gian thực thi.

#### 📚 Khung Chương Trình (Syllabus Structure)
- **Chuyên đề 1: Nhập môn & Tư duy nền tảng** - Định vị vai trò cá nhân và xây dựng mục tiêu hành động.
- **Chuyên đề 2: Kỹ thuật vận dụng thực tiễn** - Nghiên cứu tình huống (case studies) và giải bài toán tình huống doanh nghiệp.
- **Chuyên đề 3: Kiểm chuẩn & Đánh giá cải tiến** - Thực hành đo lường chất lượng đầu ra sau chu kỳ bồi dưỡng chuyên biệt.

#### ✨ Hành Động Sau Đào Tạo (Actionable Takeaways)
- Lập sơ đồ áp dụng thực tế (action plan) nộp cho L&D giám sát kết quả thực thi công việc trong vòng 30 ngày.`
        : `#### 🎯 Core Objectives
- Comprehensively develop core conceptual frameworks and operational application skills for **${courseName}**.
- Standardize key technical toolsets to monitor performance metrics and optimize delivery workflows.

#### 📚 Syllabus Structure
- **Module 1: Principles and Foundation** - Align personal responsibilities to macro-level business objectives.
- **Module 2: Practical Implementation** - Analyze scenario-based group studies and local department problem solving.
- **Module 3: Impact Auditing & Optimization** - Practice qualitative result tracking and operational feedback cycles.

#### ✨ Actionable Takeaways
- Complete a 30-day post-training execution checklist and submit it to the L&D supervisor to verify transfer of learning.`;
      return res.json({ syllabus: fallbackSyllabus });
    }
  });

  // API: Get highly personalized individual development plan suggestions matching internal proposed programs
  app.post("/api/gemini/individual-idp-advice", async (req, res) => {
    let localFallbackList: any[] = [];
    try {
      const { empName, title, department, lang, items } = req.body;
      const employeeName = empName || "Nhân sự";
      const empTitle = title || "Chuyên viên";
      const empDept = department || "All";
      const idpItems = Array.isArray(items) ? items : [];

      // List of actual proposed/approved internal courses from the company database (Requirement 1 & 2)
      const internalCourses = [
        "AI for Everyone; Power Automate in Office",
        "Servant Leadership",
        "Communication & Presentation",
        "Coaching & Mentoring",
        "People Development / IDP & Skill Matrix",
        "Succession Planning & Talent Pipeline Review"
      ];

      // Robust fallback recommendations matcher strictly based on internal collected data & proposed approval items
      const generateFallbackAdvice = () => {
        const fallbacks: any[] = [];
        
        // Match up to 3 recommendations from actual items of the employee
        const limit = Math.min(idpItems.length, 3);
        for (let i = 0; i < limit; i++) {
          const item = idpItems[i];
          const category = (item.trainingCategory || '').toLowerCase();
          const duty = item.jobDuty || '';
          const rating = (item.rRating || '').toUpperCase();

          let matchedCourse = "People Development / IDP & Skill Matrix";
          let actionLabel = "Department self follow-up";
          let adviceText = `Participate in departmental skills checklists for "${duty}" task to improve competency.`;
          let viAdviceText = `Tham gia kiểm tra danh mục kỹ năng bộ phận đối với nhiệm vụ "${duty}" để cải thiện năng lực.`;

          if (category.includes('digital') || category.includes('số') || category.includes('tech') || category.includes('it') || category.includes('máy tính') || category.includes('automation')) {
            matchedCourse = "AI for Everyone; Power Automate in Office";
            actionLabel = "Add to Training Plan";
            adviceText = `Given readiness level ${rating || 'R2'}, leverage internal AI training to automate direct business reporting and eliminate manual Excel tasks in ${empDept}.`;
            viAdviceText = `Với mức sẵn sàng ${rating || 'R2'}, tận dụng khóa học AI nội bộ để tự động hóa báo cáo kinh doanh trực tiếp và loại bỏ các tác vụ thủ công tại bộ phận ${empDept}.`;
          } else if (category.includes('leadership') || category.includes('lãnh đạo') || category.includes('quản lý') || category.includes('con người') || category.includes('people') || category.includes('giám sát')) {
            matchedCourse = "Servant Leadership";
            actionLabel = "Add to Training Plan";
            adviceText = `As a ${empTitle} with readiness ${rating || 'R2'}, this course is highly recommended to establish higher employee trust and active listening in daily team coordination.`;
            viAdviceText = `Với vai trò ${empTitle} và mức sẵn sàng ${rating || 'R2'}, đề xuất tham gia lớp Lãnh đạo Phục vụ để tạo lập niềm tin tinh thần và lắng nghe thấu cảm trong điều phối hoạt động hàng ngày.`;
          } else if (category.includes('soft') || category.includes('mềm') || category.includes('giao tiếp') || category.includes('communication') || category.includes('presentation')) {
            matchedCourse = "Communication & Presentation";
            actionLabel = "Add to Training Plan";
            adviceText = `Develop professional presentation and technical communication skills to share operational progress reports effectively.`;
            viAdviceText = `Phát triển kỹ năng giao tiếp kỹ thuật và thuyết trình chuyên nghiệp để trình bày báo cáo vận hành hiệu quả trước tổ trưởng ban ngành.`;
          } else if (category.includes('coaching') || category.includes('kèm cặp') || category.includes('huấn luyện')) {
            matchedCourse = "Coaching & Mentoring";
            actionLabel = "Add to Training Plan";
            adviceText = `Equips you with active instruction guidelines to lead subordinate development plans under close peer review.`;
            viAdviceText = `Trang bị quy chuẩn hướng dẫn kèm cặp thực hiện lộ trình phát triển năng lực cho nhân viên cấp dưới trực thuộc quản lý.`;
          } else if (category.includes('process') || category.includes('quy trình') || category.includes('compliance') || category.includes('tuân thủ') || category.includes('chất lượng') || category.includes('quality') || category.includes('sew') || category.includes('may')) {
            matchedCourse = "People Development / IDP & Skill Matrix";
            actionLabel = "Department self follow-up";
            adviceText = `Participate in scheduled on-the-job training for standard compliance, and perform skills-matrix review on local tasks.`;
            viAdviceText = `Thực hành kèm cặp tại chỗ về tuân thủ quy trình chuẩn hóa và đánh giá lại ma trận kỹ năng kỹ thuật của bộ phận.`;
          } else if (category.includes('cost') || category.includes('tài chính') || category.includes('finance') || category.includes('lương')) {
            matchedCourse = "Coaching & Mentoring";
            actionLabel = "Department self follow-up";
            adviceText = `Incorporate department coaching guidelines into the daily workspace to check and reduce material wastes directly.`;
            viAdviceText = `Áp dụng chỉ dẫn kèm cặp giám sát tại chỗ vào lịch công nghệ để trực tiếp kiểm soát và đào tạo giảm hao phí nguyên vật liệu dệt may.`;
          }

          fallbacks.push({
            id: `idp_rec_fall_${i}_${item.id}`,
            mappedGaps: category.toUpperCase() || "DEVELOPMENT FOCUS",
            targetDuty: duty,
            internalProgram: matchedCourse,
            actionType: actionLabel,
            advice: adviceText,
            viAdvice: viAdviceText,
            timeline: item.timeline || "Within 6 months"
          });
        }

        // Fill remaining with defaults if empty
        while (fallbacks.length < 3) {
          const index = fallbacks.length;
          fallbacks.push({
            id: `idp_rec_fall_def_${index}`,
            mappedGaps: "GENERAL SKILL GAPS",
            targetDuty: "Nâng cao nghiệp vụ / General Skills Enhancement",
            internalProgram: "People Development / IDP & Skill Matrix",
            actionType: "Department self follow-up",
            advice: "Standard active self-learning and departmental coaching in the current scope of work.",
            viAdvice: "Tự đào tạo chủ động chuẩn hóa kết hợp kèm cặp chuyên môn theo hướng dẫn của giám sát bộ phận.",
            timeline: "Q3/2026"
          });
        }
        return fallbacks;
      };

      localFallbackList = generateFallbackAdvice();

      try {
        const client = getGeminiClient();
        const prompt = `
You are an expert personal L&D Advisory Chatbot and Career Orientation Coach.
You are helping employee "${employeeName}" (Title: "${empTitle}", Department: "${empDept}") with their Individual Development Plan (IDP).

The employee's current IDP goals and performance gap items are:
${JSON.stringify(idpItems, null, 2)}

We must map their needs Strictly to the existing company-wide proposed training course pool currently undergoing approval.
THE ACTUAL APPROVED INTERNAL COURSE OPTIONS ARE EXCLUSIVELY:
${JSON.stringify(internalCourses, null, 2)}

Your task is to review the employee's IDP item entries (especially their Category, Job Duty, and Readiness Rating) and generate exactly 3 highly personalized, realistic personal development recommendations.
Each recommendation must match their gap to one of the approved internal course options above. Do NOT formulate external or far-fetched courses.

Please output the response strictly as a raw JSON array containing exactly 3 objects.
DO NOT include any markdown packaging like \`\`\`json, notes, or additional introductory sentences. Return ONLY the raw JSON array.

Each object in the array MUST contain the exact following keys:
- "id": unique string identifier (e.g. "idp_rec_1", "idp_rec_2", "idp_rec_3")
- "mappedGaps": string (The name of the gap category or specific job duty this addresses)
- "targetDuty": string (The exact job duty text or shortened version from the employee's item)
- "internalProgram": string (MUST be an exact string match from the permitted approved internal course options array list above)
- "actionType": string (Either 'Add to Training Plan' or 'Department self follow-up')
- "advice": string (Specific personal development guidance customized for ${employeeName} detailing why this approved course fits their readiness level and helps their specific job duty)
- "viAdvice": string (Vietnamese localized translation of the advice, professionally formatted for the employee's review)
- "timeline": string (Recommended specific timeline, e.g., 'Q3/2026' or 'Q4/2026')

Validate your output JSON compliance carefully. Output the raw JSON array now.
`;

        const response = await callGeminiWithRetry((modelName) =>
          client.models.generateContent({
            model: modelName,
            contents: prompt,
          })
        );

        const rawText = response.text?.trim() || "";
        let cleanText = rawText;
        if (cleanText.startsWith("\`\`\`json")) {
          cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith("\`\`\`")) {
          cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith("\`\`\`")) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        cleanText = cleanText.trim();

        const aiData = JSON.parse(cleanText);
        if (Array.isArray(aiData) && aiData.length === 3) {
          // Double check program names match approved list
          const safeData = aiData.map((item: any) => {
            const matched = internalCourses.find(c => c.toLowerCase() === (item.internalProgram || '').toLowerCase());
            if (matched) {
              item.internalProgram = matched;
            } else {
              item.internalProgram = "Function-specific Development Plan";
            }
            return item;
          });
          return res.json({ data: safeData, source: "gemini" });
        }
      } catch (gem_err: any) {
        console.log(`[Gemini Fallback] Personal AI IDP suggester fallback activated. Status: ${String(gem_err?.message || gem_err).substring(0, 80)}`);
      }

      return res.json({ data: localFallbackList, source: "fallback" });
    } catch (err: any) {
      console.log(`[Gemini Fallback] individual-idp-advice top-level fallback activated. Status: ${String(err?.message || err).substring(0, 80)}`);
      return res.json({ data: localFallbackList, source: "fallback" });
    }
  });

  // API: Predicting employee's career progression path via Gemini 3.5-flash
  app.post("/api/gemini/career-prediction", async (req, res) => {
    const { name, dept, cell, history, idpProgress, lang } = req.body;
    try {
      if (!name || !cell) {
        return res.status(400).json({ error: "Missing required properties (name, cell)." });
      }

      const client = getGeminiClient();
      const langText = lang === "VI" ? "Vietnamese" : "English";

      const prompt = `
You are an advanced AI Succession Planning Director and Organizational Design Coach.
You are predicting the "Next Step" career transition for employee "${name}" currently in the "${dept}" department.

Current Talent Context for ${name}:
- 9-Box Cell: ${cell}
- 9-Box Movement History: ${history || "No formal history"}
- Individual Development Plan (IDP) Progress: ${idpProgress}% Completed

Based on this talent reviewed trajectory and their active completion rate, predict:
1. **Target Next Role** (A realistic next position within the company, e.g., Senior Supervisor, Assistant Mgr, or Dept Head).
2. **Target Next Department** (The most fitting department or sector).
3. **Suitability Match Score** (A percentage matching their current performance/readiness, e.g. "94%").
4. **Readiness Timeline** (Estimate of transition readiness: 'Ready Now', '6-12 Months', or '1-2 Years').
5. **Career Transition Rationale** (A professional, concise explanation describing *why* they are suited for this career step and what focus area is needed to bridge any gaps).

IMPORTANT: Return your response strictly as a raw JSON object. Do NOT wrap the JSON inside markdown format blocks like \`\`\`json. Output ONLY the raw JSON block.
The keys of the JSON object MUST be exactly:
- "targetRole": string
- "targetDept": string
- "suitabilityMatch": string (e.g. "92%")
- "readiness": string (e.g. "6-12 Months")
- "rationale": string (All explanations must be in ${langText}. Provide a professional, encouraging career review rationale)

Generate and output the raw JSON object now.
`;

      const response = await callGeminiWithRetry((modelName) =>
        client.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );

      const rawText = response.text?.trim() || "";
      let cleanText = rawText;
      if (cleanText.startsWith("\`\`\`json")) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith("\`\`\`")) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith("\`\`\`")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const prediction = JSON.parse(cleanText);
      return res.json({ prediction });
    } catch (error: any) {
      console.log(`[Gemini Fallback] Career prediction fallback activated. Status: ${String(error?.message || error).substring(0, 80)}`);
      // High-quality local heuristic fallback matching
      const isGrower = ["Superstar", "High Professional", "Rising Star"].includes(cell);
      const isKeeper = ["Seasoned Professional", "Solid Professional", "Valued Contributor"].includes(cell);
      
      const fallbackPrediction = {
        targetRole: isGrower 
          ? (lang === "VI" ? "Phó Trưởng bộ phận phụ trách" : "Acting Assistant Department Manager") 
          : (lang === "VI" ? "Chuyên viên Cao cấp / Tổ Trưởng chuyên môn" : "Senior Domain Specialist / Lead Supervisor"),
        targetDept: dept || "Operations",
        suitabilityMatch: isGrower ? "95%" : "88%",
        readiness: isGrower ? "Ready Now" : "6-12 Months",
        rationale: lang === "VI" 
          ? `Dựa trên phân tích 9-Box (${cell}) và tiến độ IDP đạt ${idpProgress}%, nhân sự thể hiện tính cam kết cao. Khuyến nghị bồi dưỡng nâng cao quản lý để đảm nhiệm chức danh cao hơn.`
          : `Based on 9-Box index (${cell}) and IDP progress of ${idpProgress}%, the employee shows high commitment. Targeted functional upskilling is recommended for their next role.`
      };
      return res.json({ prediction: fallbackPrediction, fallback: true });
    }
  });

  app.post("/api/gemini/peer-mentors", async (req, res) => {
    try {
      const { mentee, superstars, lang } = req.body;

      if (!mentee || !superstars || !Array.isArray(superstars)) {
        return res.status(400).json({ error: "Missing required request parameters (mentee and superstars list)." });
      }

      const client = getGeminiClient();
      const langText = lang === "VI" ? "Vietnamese" : "English";

      const prompt = `
You are an expert L&D Director and Executive Coach representing Millennium TR&SP.
Your objective is to suggest 1-2 potential mentors from our actual 'Superstar' cohort for a given employee (mentee).

Subject Mentee (The Employee):
- Name: ${mentee.name}
- Department: ${mentee.dept}
- Current 9-Box position: ${mentee.cell}
- Performance status: ${mentee.results}
- Potential evaluation: ${mentee.potential}

Available mentors from the 'Superstar' cohort:
${JSON.stringify(superstars, null, 2)}

Instructions:
1. Identify 1 or 2 matching mentors from the provided Superstar list above.
   - You can match a mentor in the SAME department (for deep functional/technical skills mentorship) or in a DIFFERENT department (for cross-functional leadership, transition coaching, and general business coordination).
2. Write a highly inspiring, tailored and constructive mentorship description for each pairing. Explain *why* they fit based on their departments or roles.
3. Outline 2 highly concrete collaboration activities they can carry out together (e.g. shadow meetings, monthly development audits, peer-to-peer code/process review).
4. Strictly return your response as clean Markdown. Do NOT use HTML formatting.
5. The language of the entire output MUST be fully in ${langText}.
`;

      const response = await callGeminiWithRetry((modelName) =>
        client.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI engine.");
      }

      return res.json({ advice: responseText, fallback: false });
    } catch (error: any) {
      console.log(`[Gemini Fallback] Peer-to-Peer advice loaded via heuristic fallback. Status: ${String(error?.message || error).substring(0, 80)}`);
      const { mentee, superstars, lang } = req.body;
      
      const filtered = superstars.filter((s: any) => s.name?.toUpperCase() !== mentee.name?.toUpperCase());
      const sameDept = filtered.find((s: any) => s.dept === mentee.dept);
      const chosenMentor = sameDept || filtered[0] || { name: "Anh Le", dept: "Plant Engineering" };

      const fallbackText = lang === "VI" 
        ? `### 👥 Khuyến Nghị Cặp Đôi Đồng Nghiệp (AI Fallback Match)

Chúng tôi đã khớp nối **${mentee.name}** với Cố vấn Học tập xuất sắc từ nhóm **Superstar**:

#### 👔 Huấn Luyện Viên Đề Xuất: ${chosenMentor.name} (Bộ phận: ${chosenMentor.dept})
* **Lý do ghép cặp tiêu chuẩn:** ${chosenMentor.dept === mentee.dept 
              ? `Cả hai cùng thuộc bộ phận **${mentee.dept}**. Sự am hiểu sâu sắc về chuyên môn nghiệp vụ tại đây giúp ${chosenMentor.name} dễ dàng chia sẻ bộ tài liệu kỹ thuật thực tế và kinh nghiệm giải quyết nút thắt vận hành tại chỗ.` 
              : `Kết nối liên bộ phận giữa **${mentee.dept}** và **${chosenMentor.dept}**. Việc ghép đôi thúc đẩy bồi dưỡng tư duy hệ thống, phát triển tầm nhìn liên thông chuỗi cung ứng và nghiệp vụ quản lý chéo phòng ban.`}

#### 🎯 Kế hoạch Hành động Học tập Chung:
1. **Chia sẻ Giáo án & Shadowing (30 ngày đầu):** Sắp xếp lịch làm việc chung hàng tuần để người học tập kiến tập phong thái làm việc quản lý dự án thực tế của Cố vấn.
2. **Đồng kiểm và đánh giá IDP định kỳ (Hàng tháng):** Thực hiện phiên cố vấn 1-on-1 trong 45 phút để cập nhật tiến độ hoàn thành các khóa học L&D và điều chỉnh năng lực.`
        : `### 👥 Peer-to-Peer Development Recommendation (AI Fallback Match)

We have matched **${mentee.name}** with a premium learning mentor from our **Superstar** cohort:

#### 👔 Suggested Peer Coach: ${chosenMentor.name} (Department: ${chosenMentor.dept})
* **Rationale for Selection:** ${chosenMentor.dept === mentee.dept 
              ? `Both belong to the **${mentee.dept}** department. This shared domain environment allows ${chosenMentor.name} to transfer advanced technical methodologies and share practical solutions to local operational bottlenecks.` 
              : `Cross-functional pairing between **${mentee.dept}** and **${chosenMentor.dept}** departments. This expands enterprise-wide perspective, facilitates system thinking, and cultivates high-level organizational coordination skills.`}

#### 🎯 Action Steps for Collaborative Development:
1. **Role Shadowing & Check-ins (First 30 days):** Schedule a bi-weekly sync session to observe project management workflows and high-level decision structures.
2. **Joint L&D Audits (Monthly):** Conduct a 45-minute structured peer review to evaluate Individual Development Plan (IDP) completions and exchange cross-functional learnings.`;

      return res.json({ advice: fallbackText, fallback: true });
    }
  });

  app.post("/api/gemini/dept-insight", async (req, res) => {
    try {
      const { dept, total, growers, growersPct, keepers, keepersPct, movers, moversPct, businessPhase, profile, lang } = req.body;

      if (!dept) {
        return res.status(400).json({ error: "Missing department name." });
      }

      const client = getGeminiClient();
      const langText = lang === "VI" ? "Vietnamese" : "English";

      const prompt = `
You are a down-to-earth Business Advisor helping Department Heads (HODs/Line Managers) understand their team's talent composition.
Your goal is to provide a brief, practical, and highly simple team analysis and actionable recommendations for the "${dept}" department.

Important tone guidelines:
- CRITICAL: Use normal, friendly, everyday business language.
- DO NOT use complex, high-level HR, L&D, or academic jargon (e.g., avoid terms like "organizational design maturity", "structural competency deficit", "succession headroom mapping" or similar academic concepts).
- Use clear and simple metaphors. Explain things in plain terms of:
  * "Nhóm nhân viên Tiềm năng (Growers)": agile people who learn fast and can take on big responsibilities.
  * "Nhóm nhân viên Vững vàng/Nòng cốt (Keepers)": sturdy executioners who keep daily tasks running smoothly.
  * "Nhóm nhân viên Cần rèn luyện (Movers)": people who need more coaching, training, or support.
- Make the advice easy to present to other non-HR leaders.

Department Metrics:
- Department: ${dept}
- Total personnel: ${total}
- Growers (High-potential stars): ${growers} (${growersPct}%)
- Keepers (Core operators): ${keepers} (${keepersPct}%)
- Movers (Need support/New hires): ${movers} (${moversPct}%)
- Business Phase (Current situation): ${businessPhase === "FAST_GROWTH" ? "Rapid Growth / High tempo" : "Stable Operation / Standard Quality and Maintenance"}
- Current Team Structure Profile: ${profile}

Please respond in ${langText}.
Use simple headings (e.g., #### 💡 Đánh giá về đội ngũ, #### ⚠️ Những lưu ý thực tế, #### 🎯 Gợi ý hành động thực tế cho Quản lý).
Start directly with the Markdown response.
`;

      const response = await callGeminiWithRetry((modelName) =>
        client.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI engine.");
      }

      return res.json({ insight: responseText, fallback: false });
    } catch (error: any) {
      console.log(`[Gemini Fallback] Department insight loaded via fallback. Status: ${String(error?.message || error).substring(0, 80)}`);
      const { dept, total, growersPct, keepersPct, moversPct, lang } = req.body;
      const fallbackInsight = lang === "VI"
        ? `#### 💡 Đánh giá về đội ngũ thuộc phòng ${dept || "Hệ Thống"}
Đội ngũ gồm **${total || 10}** nhân sự có cơ cấu cân đối với **${growersPct || 30}%** nhân sự Tiềm Năng (Growers), **${keepersPct || 50}%** nhân sự Nòng Cốt (Keepers) và **${moversPct || 20}%** nhân sự Cần Bồi Dưỡng (Movers). Đây là nhóm nhân sự có tính đa dạng lớn, bổ khuyết tốt cho nhau trong vận hành.

#### ⚠️ Những lưu ý thực tế
* **Cân đối phân giao công việc:** Tránh dồn quá nhiều trách nhiệm lên nhóm nhân viên Tiềm năng (Growers) gây ra hiện tượng kiệt sức hoặc tăng rủi ro dịch chuyển nhân sự.
* **Mở rộng năng lực nòng cốt:** Nhóm nhân viên Vững vàng (Keepers) chiếm tỷ trọng lớn cần được tiếp cận các chuẩn hóa công nghệ mới để duy trì hiệu suất ổn định lâu dài.

#### 🎯 Gợi ý hành động thực tế cho Quản lý
1. **Thiết lập cơ chế Kèm cặp Chéo:** Ghép cặp chéo trực tiếp giữa nhân sự Tiềm năng với nhóm cần rèn luyện hỗ trợ công tác thực địa.
2. **Phê duyệt IDP định kỳ tháng:** Động viên và kiểm tra tiến thoái các cột mốc đào tạo trực tuyến của nhóm thông lượng.`
        : `#### 💡 Team Composition Overview for ${dept || "Operations"}
An agile team of **${total || 10}** members consisting of **${growersPct || 30}%** high-potential Growers, **${keepersPct || 50}%** essential Keepers, and **${moversPct || 20}%** development-focused Movers. This presents a balanced delivery structure that drives collaborative success.

#### ⚠️ Practical Considerations
* **Avoid Burnout Hazards:** Focus on keeping key high-performing Growers challenged but supported, avoiding excessive burden.
* **Stabilize the Engine:** Support your reliable Keepers with modern functional workshops to secure continuous, high-quality performance.

#### 🎯 Direct Action Steps for Managers
1. **Institute Buddy Mentorship:** Leverage cross-department learning pairings where high-affinity performers coach team peers.
2. **Review Monthly IDP Milestones:** Spend 15 minutes checking progress lists during standard operational performance conversations.`;

      return res.json({ insight: fallbackInsight, fallback: true });
    }
  });

  // App Health Check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware for development vs Static dist files in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application container running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Full-Stack express server:", err);
});
