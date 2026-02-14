const fs = require('fs');
const apiKey = "AIzaSyCSBygvGm4ePoU24wLFRpPPleseqqnGsXI";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            fs.writeFileSync('models.txt', "API Error: " + data.error.message);
            return;
        }

        const modelNames = data.models.map(m => m.name);
        fs.writeFileSync('models.txt', modelNames.join('\n'));
        console.log("Saved models to models.txt");
    } catch (err) {
        fs.writeFileSync('models.txt', "Fetch Error: " + err.message);
    }
}

listModels();
