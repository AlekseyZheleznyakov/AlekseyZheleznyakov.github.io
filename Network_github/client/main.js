import { io } from "socket.io-client";

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(socket.id);
    socket.on("MessageFromServer", function (msg) {
      document.getElementById("all").value += ("\n" + msg);
      document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight;
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
  });

  document.getElementById("id1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = document.getElementById("id1").value;
      document.getElementById("id1").value = "";

      socket.emit("MessageToServer", value);
    }
  };

  document.getElementById("id2").onkeyup = (ev) => {
    const value = document.getElementById("id2").value;

    socket.emit("ChangedName", value);
  };
}

window.addEventListener("load", (event) => {
  main();
});
