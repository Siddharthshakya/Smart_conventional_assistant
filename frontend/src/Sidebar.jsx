import "./Sidebar.css";
import { useContext, useEffect } from "react";
import{ MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try{
            const response = await fetch(`${API_BASE_URL}/chat/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            console.log(filteredData);
            setAllThreads(filteredData);

            //threadId
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])



    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }


    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`${API_BASE_URL}/chat/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err){
            console.log(err);
        }
    }


    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/thread/${threadId}`, {
            method: "DELETE",
          });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="/gemini-color.png" alt="Gemini logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx)=>(
                        <li key={idx} onClick={() => changeThread(thread.threadId)} 
                        className={thread.threadId === currThreadId ? "highlighted": " "}>
                            {thread.title}
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation(); //stop event bubbling
                                deleteThread(thread.threadId); 
                            }}></i>
                        </li>
                    ))
                }
            </ul>

            {/* sign */}
            <div className="sign">
                <p>By Sidd_1411! &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;
