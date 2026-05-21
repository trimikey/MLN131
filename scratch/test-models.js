import fs from 'fs';

let apiKey = "";
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
  if (match) apiKey = match[1].trim();
} catch (e) {
  console.log("Error reading .env", e);
}

if (!apiKey) {
  console.log("Không tìm thấy VITE_GEMINI_API_KEY trong .env");
  process.exit(1);
}

const modelsToTest = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest"
];

async function testModels() {
  console.log(`Đang kiểm tra với API Key: ${apiKey.substring(0, 8)}...`);
  
  for (const model of modelsToTest) {
    try {
      console.log(`Testing ${model}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: "Hello" }] }] })
      });
      console.log(`${model} -> STATUS: ${res.status}`);
      if (res.status === 200) {
        console.log(`=> MODEL NÀY HOẠT ĐỘNG TỐT!`);
      } else {
        const data = await res.json();
        console.log(`  Error: ${data.error?.message?.substring(0, 100)}...`);
      }
    } catch (e) {
      console.log(`${model} -> FETCH ERROR: ${e.message}`);
    }
  }
}
testModels();
