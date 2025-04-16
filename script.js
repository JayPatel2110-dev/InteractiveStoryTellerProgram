const generateBtn = document.getElementById("generateBtn");
const storyContent = document.getElementById("storyContent");
const genreSelect = document.getElementById("genre");
const ideaInput = document.getElementById("idea");
const outputSection = document.getElementById("output");
const downloadBtn = document.getElementById("downloadBtn");
const toggleDarkModeBtn = document.getElementById("toggleDarkModeBtn");

// Replace with your real Hugging Face token
const HUGGINGFACE_API_KEY = "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";

generateBtn.addEventListener("click", async () => {
  const genre = genreSelect.value;
  const idea = ideaInput.value.trim();

  if (!idea) {
    alert("Please enter a story idea.");
    return;
  }

  storyContent.innerHTML = "<em>✨ Generating your story... please wait</em>";
  outputSection.style.display = "block";

  const prompt = `generate a detailed and imaginative story in the genre of ${genre}. Here is the idea: ${idea}`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mrm8488/t5-base-finetuned-common_gen", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 400,
          temperature: 0.9
        }
      }),
    });

    const data = await response.json();
    const outputText = data[0]?.generated_text;

    if (!outputText) {
      throw new Error("Empty response from model.");
    }

    storyContent.textContent = outputText.trim();
  } catch (err) {
    console.error("Error:", err);
    storyContent.innerHTML = "<span style='color: red;'>❌ Error generating story. Try again later.</span>";
  }
});

// PDF Download logic
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const text = storyContent.textContent;
    const blob = new Blob([text], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my_story.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Toggle dark mode logic
if (toggleDarkModeBtn) {
  toggleDarkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}
