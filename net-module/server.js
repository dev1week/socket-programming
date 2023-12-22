//net 모듈을 추가합니다.
const net = require("net");

//createServer()를 이용해 Tcp 서버를 생성합니다.
const server = net.createServer((socket) => {
  //"data"라는 구분자로 클라이언트에서 오는 값을 받습니다.
  socket.on("data", (data) => {
    console.log("From client: ", data.toString());
  });

  //"close"는 net모듈에 등록된 키워드로 클라이언트에서 소켓을 닫을 때 응답합니다.
  socket.on("close", () => {
    console.log("client disconnected");
  });

  //write를 이용해 서버에서 클라이언트로 메시지를 전달합니다.
  socket.write("welcome to srver");
});

server.on("error", (err) => {
  console.log("err" + err);
});

//6000번 포트를 열고 기다립니다.
server.listen(6000, () => {
  console.log("listening on 6000");
});
