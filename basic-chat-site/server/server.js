//ws 모듈을 추가
const WebSocket = require("ws");

//5000포트로 접속할 수 있는 웹 소켓 서버를 생성한다.
const wss = new WebSocket.Server({ port: 5000 });

//ws 모듈에서 on()을 활용해 connection, message, close 와 같은 상태를 확인할 수 있다.
wss.on("connection", (ws) => {
  //ws 모듈은 브로드 캐스트를 정의하지 않음

  const broadCastHandler = (msg) => {
    wss.clients.forEach(function each(client, i) {
      //내가 보낸 메시지를 다시 받지 않기 위해 client !==ws 조건 추가
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  //클라이언트에 오는 메시지 수신

  ws.on("message", (res) => {
    const { type, data, id } = JSON.parse(res);
    //type으로 클라이언트에 오는 메시지를 구분한다.
    switch (type) {
      //최초 접속시
      case "id":
        broadCastHandler(JSON.stringify({ type: "welcome", data: data }));
        break;
      case "msg":
        broadCastHandler(JSON.stringify({ type: "other", data: data, id: id }));
        break;
      default:
        break;
    }
  });

  ws.on("close", () => {
    console.log("client has disconnected");
  });
});
