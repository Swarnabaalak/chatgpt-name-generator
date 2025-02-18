require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/generate-names", async (req, res) => {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: "Category is required" });

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are an AI name generator." },
                    { role: "user", content: `Generate 5 unique names for ${category}` }
                ],
                temperature: 0.8
            },
            {
                headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }
            }
        );

        const names = response.data.choices[0].message.content.split("\n").filter(name => name.trim() !== "");
        res.json({ names });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to generate names" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
