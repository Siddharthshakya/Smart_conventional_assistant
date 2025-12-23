import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";


function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); //set default false value

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("message ", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/chat/chat`,
          options
        );

      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Append new chat to previous chat
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
          ...prevChats,
          {
            role: "user",
            content: prompt,
          },
          {
            role: "assistant",
            content: reply,
          },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          AlphaGemini<i className="fa-solid fa-angles-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
        {
          isOpen && <div className="dropDown">
            
            <div className="dropDownItem"><i class="fa-solid fa-gear"></i>Setting</div>
            <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
            <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i>LogOut</div>
            <div className="dropDownItem"><i class="fa-solid fa-user-gear"></i>Personalize</div>
          </div>
        }
      </div>
      <Chat></Chat>

      <ScaleLoader color="white" loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask AlphaGemini"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          AlphaGemini can make mistakes, so double-check it.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
