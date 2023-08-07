import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY
});
console.info(llm)

// Create a function that takes in a string and returns a response from the OpenAI language model
const talkToLlm = async (input: string) => {
  const response = await llm.query(input);
  return response.data.choices[0].text;
};


// Use the talkToLlm function to create a conversation loop
const conversationLoop = async () => {
  let input = '';

  const readline = async (): void => {
      let input = prompt("Please enter your input: ");
      return input;
  };

  while (input !== 'exit') {
    console.log('Say something:');
    input = await readline();

    if (input !== 'exit') {
      const response = await talkToLlm(input);
      console.log(response);
    }
  }
};

conversationLoop();

