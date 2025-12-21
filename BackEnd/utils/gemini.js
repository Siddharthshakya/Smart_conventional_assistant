import "dotenv/config";
import fetch from "node-fetch";

const MODEL_NAME = "gemini-2.5-flash"; 
const BASE_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

const getApiUrl = () => {
    const apiKey = process.env.GOOGLE_API_KEY; 
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    return `${BASE_GEMINI_URL}${MODEL_NAME}:generateContent?key=${apiKey}`;
};


const getGeminiAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ 
                    text: message
                }]
            }]
        })
    };

    try {
        const response = await fetch(getApiUrl(), options);
        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Gemini API Error:", data.error || data);
            throw new Error(`API Request Failed: ${data.error?.message || response.statusText}`);
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
            return generatedText;
        } else {
            console.warn("Gemini response lacked text content:", data);
            return "Error: Model returned no text, possibly blocked by safety settings.";
        }
        
    } catch (err) {
        console.error("Gemini API Fetch Error:", err);
        return `Error processing request: ${err.message}`; 
    }
};

export default getGeminiAPIResponse;