const pos2 = ['I', 'l'];
const pos10 = ['g', 'q', '9'];
const pos13 = ['1', 'l', 'I'];
const pos20 = ['f', 't'];
const pos32 = ['k', 'K', 'l'];

const candidates = [];

for (const p2 of pos2) {
  for (const p10 of pos10) {
    for (const p13 of pos13) {
      for (const p20 of pos20) {
        for (const p32 of pos32) {
          const key = `A${p2}zaSyCVv${p10}Mz${p13}VpiX3p${p20}UEW0wyfxyC5${p32}hPX1-NE`;
          candidates.push(key);
        }
      }
    }
  }
}

async function testKeys() {
  console.log(`Đang chạy brute-force ${candidates.length} tổ hợp API Key...`);
  
  // We can do it sequentially or in small parallel chunks
  // Let's do it in chunks of 10 to be polite to the server
  const chunkSize = 10;
  for (let i = 0; i < candidates.length; i += chunkSize) {
    const chunk = candidates.slice(i, i + chunkSize);
    const promises = chunk.map(async (key) => {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
          })
        });
        const data = await res.json();
        return { key, status: res.status, message: data.error?.message };
      } catch (err) {
        return { key, status: 0, message: err.message };
      }
    });

    const results = await Promise.all(promises);
    for (const result of results) {
      if (result.status === 200) {
        console.log(`\n🎉 TÌM THẤY KEY CHÍNH XÁC!`);
        console.log(`KEY: ${result.key}`);
        return result.key;
      }
    }
    process.stdout.write(".");
  }
  console.log("\nKhông tìm thấy API Key nào hoạt động trong 108 tổ hợp.");
  return null;
}

testKeys().then(successfulKey => {
  if (successfulKey) {
    // If we found it, let's write it to the .env file automatically!
    const fs = require('fs');
    fs.writeFileSync('.env', `VITE_GEMINI_API_KEY=${successfulKey}\n`);
    console.log("Đã cập nhật file .env thành công với key hoạt động!");
  }
});
