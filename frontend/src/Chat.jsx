import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import React, { useContext, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import 'highlight.js/styles/github-dark.css';


//react-markdown
//rehype-highlight



function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);


  useEffect(() => {
      if(reply === null) {
        setLatestReply(null);
        return;
      }


      //latestReply seprate => typing effect create
      if(!prevChats?.length) return;

      const content = reply.split(" "); //individual words

      let idx = 0;
      const interval = setInterval(() => {
        setLatestReply(content.slice(0, idx+1).join(" "));

        idx++;
        if(idx >= content.length) clearInterval(interval);
      },40);

      return () => clearInterval(interval);


  }, [prevChats, reply])

  return (
    <>
      {newChat && <h1>What are you working on?</h1>}
      <div className="chats">
        {prevChats?.slice(0,-1).map((chat, idx) =>
          <div
            className={chat.role === "user" ? "userDiv" : "GeminiDiv"}
            key={idx}>
            {
                chat.role === "user" ? 
                <p className="userMessage">{chat.content}</p> : 
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
            }
          </div>
        )
        }

        {
          prevChats.length > 0 && (
            <>
            {
            latestReply === null ? (
              <div className="GeminiDiv" key={"typing"}>
              <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
          </div>
          ) : (
            <div className="GeminiDiv" key={"typing"}>
              <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
          </div>
          )
        }
        </>
          )}
        

        
        
      </div>
    </>
  );
}

export default Chat;
