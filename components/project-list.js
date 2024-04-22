import projectModel from "../models/project.js";

export default class ProjectList extends HTMLElement {
    constructor() {
        super();

        this.projects = [];
    }


    // connect component
    async connectedCallback() {
        try {
            this.projects = await projectModel.fetchProjects();

            this.render();
        } catch (error) {
            this.errorView();
        }
    }

    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(`.project {
            border: 1px solid #ccc;
            padding: 1rem;
            margin-bottom: 1.4rem;
        }
        .button {
            color: #0e6620;
            background-color: #2ecc40;
            border: 1px solid #0e6620;
            padding: 0.75rem 1rem;
            text-decoration: none;
            border-radius: 4px;
        }`);

        shadow.adoptedStyleSheets = [sheet];

        for (let i = 0; i < this.projects.length; i++) {
            let p = this.projects[i];
            let element = document.createElement("div");

            element.classList.add("project");

            let name = document.createElement("p");

            name.textContent = `${p.name} - ${p.responsible}`;

            let button = document.createElement("a");

            button.textContent = "Gå till projektet";
            button.href = `#project/${p.id}`;
            button.classList.add("button");

            element.appendChild(name);
            element.appendChild(button);

            shadow.appendChild(element);
        }
    }

    errorView() {
        this.innerHTML = `<p>Could not load projects.</p>`;
    }
}
