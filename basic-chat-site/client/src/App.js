import React, { useEffect, useState, useRef, cloneElement } from "react";
import logo from "./images/websocket.png";
import "./App.css";

//웹 소켓 객체를 초기화하고 연결하는 작업
//주의할 점은 소켓 주소에 ws://로 프로토콜을 명시한다.
//실제 서비스에서는 wss 사용을 추천한다.

// 1
const webSocket = new WebSocket("ws://localhost:5000");

function App() {
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [msg, setMsg] = useState("");
  //메시지 내용은 배열형태로 저장하고 리스트를 활용해 차례로 출력한다.
  const [msgList, setMsgList] = useState([]);

  //웹 소켓의 메서드를 정의한다.
  useEffect(() => {
    if (!webSocket) return;

    //처음 소켓 연결시 실행
    webSocket.onopen = function () {
      console.log("open", webSocket.protocol);
    };

    //서버에서 온 메시지를 받는다.
    webSocket.onmessage = function (e) {
      //서버에서 온 메시지를 받는다.
      const { data, id, type } = JSON.parse(e.data);
      setMsgList((prev) => [
        ...prev,
        {
          //type은 두가지로 welcome과 other로 나뉜다.
          msg: type === "welcome" ? `${data} join the chat` : data,
          type: type,
          id: id,
        },
      ]);
    };
    //소켓 종료시 사용한다.
    webSocket.conclose = function () {
      console.log("close");
    };
  });

  //5. 자동으로 스크롤을 내립니다.
  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //6. 로그인 시 아이디를 입력한 후 Login 버튼을 클릭하면 실행
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "id",
      data: userId,
    };
    webSocket.send(JSON.stringify(sendData));
    setIsLogin(true);
  };

  //7. 아이디 입력을 관리
  const onChangeUserIdHandler = (e) => {
    setUserId(e.target.value);
  };

  //send 버튼을 클릭하면 실행
  const onSendSubmitHandler = (e) => {
    e.preventDefault();
    const sendData = {
      type: "msg",
      data: msg,
      id: userId,
    };

    //내가 보낸 메시지가 다른사람들에게 모두 전송되기 위해 send()메서드로 내용을 전송함
    //setMsgList()로 현재 입력된 메시지를 바로 화면에 출력함
    webSocket.send(JSON.stringify(sendData));
    //현재 입력된 메시지를 바로 화면에 출력함
    setMsgList((prev) => [...prev, { msg: msg, type: "me", id: userId }]);
    setMsg("");
  };

  const onChangeMsgHandler = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="wrap">
        {isLogin ? (
          // 10
          <div className="chat-box">
            <h3>Login as a "{userId}"</h3>
            <ul className="chat">
              {msgList.map((v, i) =>
                v.type === "welcome" ? (
                  <li className="welcome">
                    <div className="line" />
                    <div>{v.msg}</div>
                    <div className="line" />
                  </li>
                ) : (
                  <li className={v.type} key={`${i}_li`}>
                    <div className="userId">{v.id}</div>
                    <div className={v.type}>{v.msg}</div>
                  </li>
                )
              )}
              <li ref={messagesEndRef} />
            </ul>
            <form className="send-form" onSubmit={onSendSubmitHandler}>
              <input
                placeholder="Enter your message"
                onChange={onChangeMsgHandler}
                value={msg}
              />
              <button type="submit">send</button>
            </form>
          </div>
        ) : (
          <div className="login-box">
            <div className="login-title">
              <img src={logo} width="40px" height="40px" alt="logo" />
              <div>WebChat</div>
            </div>
            <form className="login-form" onSubmit={onSubmitHandler}>
              <input
                placeholder="Enter your ID"
                onChange={onChangeUserIdHandler}
                value={userId}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
