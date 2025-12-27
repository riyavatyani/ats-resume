const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAI = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Resume data required" });
    }

const prompt = `
You are an expert ATS resume writer.

TASK:
Rewrite the provided resume data into a highly professional, ATS-optimized resume.
Improve grammar, clarity, and structure WITHOUT inventing any information.

STRICT RULES:
- Do NOT add fake experience, projects, achievements, certifications, or skills
- Do NOT exaggerate or assume details
- Improve wording and clarity only
- Use strong, professional action verbs
- NO markdown, emojis, explanations
- OUTPUT PLAIN TEXT ONLY
- Skip any section that is empty or not provided
- Do NOT break one item into unnecessary multiple points

SECTION RULES:

SUMMARY:
- Exactly 3–4 professional sentences
- Clear, concise, role-focused

EXPERIENCE:
- Rewrite into clean bullet-style lines
- Do NOT use bullet symbols (•, -, *)
- Keep points concise and impact-focused

PROJECTS (if provided):
- Rewrite clearly
- If project name is given, explain what it does
- Do NOT invent projects

ACHIEVEMENTS (if provided):
- Correct spelling and grammar
- Present line-by-line
- Do NOT invent achievements

CERTIFICATIONS (if provided):
- Clean, professional formatting
- Do NOT invent certifications

EDUCATION:
- Rewrite cleanly using proper sentence structure
- Do NOT use "|" as a separator
- Use new lines where appropriate

SKILLS:
- ALWAYS include a separate Skills section
- List skills as comma-separated values
- Do NOT add new skills

LINKS (if provided):
- Keep links clean and readable
- Do NOT invent links

IMPORTANT:
- Only rewrite what is provided
- If optional sections are empty, skip them completely

RESUME DATA:
${JSON.stringify(data, null, 2)}
`;


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You write professional resumes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 900,
    });

    res.json({ text: response.choices[0].message.content });
  } catch (err) {
    console.error("🔥 OPENAI ERROR 👉", err);
    res.status(500).json({
      message: "AI generation failed",
      error: err.message,
    });
  }
};

module.exports = { generateAI };