const buildResumePrompt = (d) => {
  return `
Create a professional, ATS-optimized resume.

Candidate Details:
Name: ${d.name}
Education: ${d.education}
Experience: ${d.experience}
Skills: ${d.skills}
ATS Keywords: ${d.keywords}

Instructions:
- Write a strong professional summary (3–4 lines)
- Convert experience into bullet points
- Use action verbs
- Optimize for ATS
- Keep formatting clean
- No emojis
- Plain text output
- Sections: Summary, Skills, Experience, Education

Generate the resume.
`;
};

module.exports = buildResumePrompt;
