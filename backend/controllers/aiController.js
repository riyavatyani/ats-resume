const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateResume = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Resume data required" });
    }

    const prompt = `
You are an expert ATS resume writer.

correct spelling mistakes 
Rewrite the following resume data into a professional, ATS-optimized resume.
Do not add fake experience. Improve grammar and clarity only.
GOAL:
Rewrite the provided resume information into a highly professional,
ATS-optimized resume suitable for modern tech roles.

STRICT RULES:
- Do NOT invent experience
- Improve grammar and clarity
- Use strong action verbs
- NO markdown, emojis, explanations
- OUTPUT PLAIN TEXT ONLY
dont break one component into 2...3 bullet points
IMPORTANT:
Always include a separate "Skills" section.
List skills as bullet points or comma-separated values.


Summary:
strictly 3 to 4 professional sentences only 

Experience:
 Bullet points without bullet symbols bcoz we already have
 dont use dash bullets pls

Projects:
 Bullet points

Achievements:
cheack speelling and arrange in sequence line wise

Education:
Clean rewritten education
  
dont use | this as a seperator use next lines inverted commas etc

Resume data:
${JSON.stringify(data, null, 2)}
`;

    // ✅ CORRECT FOR openai v4+
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You write professional resumes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 900,
    });

    const aiText = response.choices[0].message.content;

    res.json({ text: aiText });
  } catch (err) {
    console.error("🔥 OPENAI ERROR FULL 👉", err);
    res.status(500).json({
      message: "AI generation failed",
      error: err.message,
    });
  }
};

//     const prompt = `
// You are an expert ATS resume writer with hiring experience.

// GOAL:
// Rewrite the provided resume information into a highly professional,
// ATS-optimized resume suitable for modern tech roles.

// STRICT RULES:
// - Do NOT invent experience
// - Improve grammar and clarity
// - Use strong action verbs
// - NO markdown, emojis, explanations
// - OUTPUT PLAIN TEXT ONLY

// OUTPUT FORMAT:

// Summary:
// 3–4 professional sentences

// Experience:
//  Bullet points without bullet symbols bcoz we already have

// Projects:
//  Bullet points

// Education:
// Clean rewritten education

// Skills:
// - Skill
// - Skill