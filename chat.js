"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

connection.on("ReceiveMessage", (user, message) => {
    const msg = document.createElement("div");
    msg.className = "message";
    msg.innerHTML = `<span class="user">${user}</span>: ${message}`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
});

connection.on("UserConnected", (connectionId) => {
    const msg = document.createElement("div");
    msg.className = "system-message";
    msg.textContent = `User ${connectionId} connected`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
});

connection.on("UserDisconnected", (connectionId) => {
    const msg = document.createElement("div");
    msg.className = "system-message";
    msg.textContent = `User ${connectionId} disconnected`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
});

sendButton.addEventListener("click", () => {
    const user = userInput.value.trim();
    const message = messageInput.value.trim();
    if (user && message) {
        connection.invoke("SendMessage", user, message).catch(err => console.error(err));
        messageInput.value = "";
    }
});

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.error(err);
        setTimeout(start, 5000);
    }
}

connection.onclose(async () => {
    await start();
});

start();