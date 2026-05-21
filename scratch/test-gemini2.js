const apiKey = "AIzaSyCVvgMz1VpiX3pfUEW0wyfxYC5khPX1-NE";
const systemPrompt = "Bạn là một giáo sư.";
const historyPayload = [{role: 'user', parts: [{text: "Hello"}]}];

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: historyPayload,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    }
  })
}).then(async (res) => {
  console.log("STATUS:", res.status);
  const data = await res.json();
  console.log("DATA:", JSON.stringify(data, null, 2));
}).catch(err => {
  console.log("ERR:", err);
});
