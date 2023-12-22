const net = require("net");

const socket = net.connect({ port: 6000 });
socket.on("connect", () => {
  console.log("connected to server");
});

//1초 간격으로 서버에 헬로 메시지를 요청함
setInterval(() => {
  socket.write("Hello");
}, 1000);

//data 구분자로 서버에서 오는 데이터를 수신
socket.on("data", (chunk) => {
  console.log("disconnected");
});

socket.on("error", (err) => {
  console.log(err);
});

socket.on("timeout", () => {
  console.log("connection time out");
});
