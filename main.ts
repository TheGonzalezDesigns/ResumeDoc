import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  temperature: 0.9,
  frequencyPenalty: 0.5,
  presencePenalty: 0.5
});

// Create a function that takes in a string and returns a response from the OpenAI language model
const talkToLlm = async (input: string) => await llm.predict(input);


// Use the talkToLlm function to create a conversation loop
const conversationLoop = async () => {
  let input = '';

  const readline = async (): Promise<string> => {
      let input = prompt("Please enter your input: ");
      return input ? input : "No response";
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

