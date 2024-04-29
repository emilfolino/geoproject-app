/* global io */

export default class ChatComponent extends HTMLElement {
    constructor() {
        super();

        this.shown = false;
        this.name = "";
    }

    connectedCallback() {
        this.innerHTML = `<span class="icon" id="start-chat">💬</span>`;

        this.render();
    }

    render() {
        const startChat = document.getElementById("start-chat");

        startChat.addEventListener("click", () => {
            if (this.shown) {
                this.shown = false;

                document.getElementById("chat-container").remove();
            } else {
                this.shown = true;

                let element = document.createElement("div");

                element.classList.add("chat-container");
                element.setAttribute("id", "chat-container");

                element.innerHTML = `
                    <label>Användarenamn:</label>
                    <input class="input" type="text" id="name">
                    <label>Meddelande</label>
                    <input class="input" type="text" id="message">
                    <gif-component></gif-component>
                    <button class="button blue-button" id="send">Skicka</button>
                    <div id="messages"></div>
                `;

                this.append(element);

                this.initChat();
            }
        });
    }

    initChat() {
        const socket = io("https://lager-chat.emilfolino.se");

        const name = document.getElementById("name");
        const messageInput = document.getElementById("message");
        const send = document.getElementById("send");
        const messages = document.getElementById("messages");

        send.addEventListener("click", function(event) {
            event.preventDefault();

            if (name.value) {
                this.name = name.value;
            }

            if (messageInput.value && this.name) {
                socket.emit('chat message', {
                    "name": this.name,
                    "message": messageInput.value
                });

                messageInput.value = '';
            }
        });

        socket.on('chat message', (msg) => {
            const item = document.createElement('p');

            let message = msg.message;

            if (message.match(/(https?:\/\/.*\.(?:png|jpg|gif))/g)) {
                message = `<img src="${message}" />`;
            }

            item.innerHTML = `${msg.name}: ${message}`;

            messages.prepend(item);
        });
    }
}
