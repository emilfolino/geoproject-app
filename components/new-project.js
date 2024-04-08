import projectModel from "../models/project.js";

export default class NewProject extends HTMLElement {
    constructor() {
        super();

        this.project = {};
    }


    // connect component
    connectedCallback() {
        this.innerHTML = "<h1>Nytt projekt</h1>";

        let form = document.createElement("form");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (this.project.name && this.project.description && this.project.responsible) {
                const response = await fetch("http://localhost:8866/projects", {
                    body: JSON.stringify(this.project),
                    headers: {
                    'content-type': 'application/json'
                    },
                    method: 'POST'
                });

                console.log(response);

                if (response.status === 201) {
                    const result = await response.json();

                    console.log(result);

                    window.location.hash = "";
                }
            }
        });

        let nameLabel = document.createElement("label");

        nameLabel.textContent = "Projektets namn:";

        form.append(nameLabel);

        let name = document.createElement("input");

        name.setAttribute("type", "text");
        name.setAttribute("name", "name");

        name.addEventListener("input", (event) => {
            this.saveInput(event);
        });

        form.append(name);

        let descLabel = document.createElement("label");

        descLabel.textContent = "Beskrivning:";

        form.append(descLabel);

        let description = document.createElement("input");

        description.setAttribute("type", "text");
        description.setAttribute("name", "description");

        description.addEventListener("input", (event) => {
            this.saveInput(event);
        });

        form.append(description);

        let respLabel = document.createElement("label");

        respLabel.textContent = "Ansvarig:";

        form.append(respLabel);

        let responsible = document.createElement("input");

        responsible.setAttribute("type", "text");
        responsible.setAttribute("name", "responsible");

        responsible.addEventListener("input", (event) => {
            this.saveInput(event);
        });

        form.append(responsible);

        let submit = document.createElement("input");

        submit.setAttribute("type", "submit");
        submit.setAttribute("value", "Skapa projekt");
        submit.classList.add("button");

        form.append(submit);


        this.append(form);

    }

    saveInput(event) {
        this.project = {
            ...this.project,
        };

        this.project[event.target.name] = event.target.value;
    }
}
