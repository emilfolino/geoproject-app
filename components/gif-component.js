import { tenorKey } from "../utils.js";

export default class GifComponent extends HTMLElement {
    constructor() {
        super();

    }

    connectedCallback() {
        let buttonElement = document.createElement("button");

        buttonElement.classList.add("button");
        buttonElement.textContent = "Sök GIF";

        buttonElement.addEventListener("click", () => {
            this.addSearchField();
            buttonElement.remove();
        });

        this.append(buttonElement);
    }

    addSearchField() {
        let searchField = document.createElement("input");

        searchField.setAttribute("type", "text");
        searchField.setAttribute("placeholder", "Sök efter en GIF");

        let container = document.createElement("div");

        container.classList.add("gif-container");

        let timer;
        searchField.addEventListener("input", (event) => {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                this.search(event.target.value, container);
            }, 500);
        });

        this.append(searchField);
    }

    async search(query, container) {
        const URL = `https://tenor.googleapis.com/v2/search?key=${tenorKey}&q=${query}&limit=10`;
        const response = await fetch(URL);
        const result = await response.json();

        container.innerHTML = "";

        result.results.forEach((gif) => {
            let element = document.createElement("img");

            element.setAttribute("src", gif.media_formats.gif.url);

            element.addEventListener("click", () => {
                let messageInput = document.getElementById("message");

                messageInput.value = gif.media_formats.gif.url;
            });

            container.append(element);
        });

        this.append(container);
    }
}
