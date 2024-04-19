import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {ChatContainer, MainContainer, Message, MessageInput, MessageList, TypingIndicator} from  "@chatscope/chat-ui-kit-react"

import reactLogo from './assets/react.svg'
import { useState } from 'react'

const API_KEY = "sk-proj-HaFUlq6d6clzR03tBC4vT3BlbkFJNOyjuevr8Eb2a9GOX7e5";

function App() {
  const [Typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    // uodate message state
    setMessages(newMessages);


    //set the typing indicator
    setTyping(true);

    //process message
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return {role: role, content: messageObject.message}
    });

    const systemMessage = {
      role: "system",
      content: "Speak like a pirate."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages // [Message1, message2, message3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    }); 
  
  }

  return (
    <>
      <div style={{position: 'relative', height:'800px', width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={Typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}

export default App
