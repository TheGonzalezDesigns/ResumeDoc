// Import the ChatGPT wrapper from LangChain
import { OpenAI } from "langchain/llms/openai";

console.log(OpenAI)

/*
// Initialize the wrapper with your OpenAI API key and other optional arguments
const model = new ChatGPT({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5,
});

// Define a prompt template for your app
const template = "This is a chat app powered by ChatGPT and LangChain.\n\nYou: {message}\nChatGPT:";

// Define a function to format the prompt with user input
const formatPrompt = (message) => {
  return template.replace("{message}", message);
};

// Define a function to call the model on the prompt and get a response
const getResponse = async (prompt) => {
  const res = await model.call(prompt);
  return res.res;
};

// Define a function to simulate a chat session with the user
const chat = async () => {
  // Get user input from stdin
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("You: ", async (message) => {
    // Format the prompt with user input
    const prompt = formatPrompt(message);

    // Call the model on the prompt and get a response
    const response = await getResponse(prompt);

    // Print the response
    console.log("ChatGPT:", response);

    // Close the readline interface
    readline.close();
  });
};

// Run the chat function
chat();
*/
