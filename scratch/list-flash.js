const apiKey = "AIzaSyCVvgMz1VpiX3pfUEW0wyfxYC5khPX1-NE";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
.then(async (res) => {
  const data = await res.json();
  const models = data.models || [];
  const textModels = models.filter(m => 
    m.supportedGenerationMethods && 
    m.supportedGenerationMethods.includes("generateContent") &&
    m.name.includes("flash")
  );
  console.log("AVAILABLE FLASH MODELS:");
  textModels.forEach(m => console.log(`- ${m.name}`));
}).catch(err => {
  console.log("ERR:", err);
});
