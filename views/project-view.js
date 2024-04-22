import projectModel from "../models/project.js";

export default class ProjectView extends HTMLElement {
    constructor() {
        super();

        this.projectid = "";
    }

    static get observedAttributes() {
        return ['projectid'];
    }

    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[property] = newValue;
    }


    async connectedCallback() {
        let projects = await projectModel.fetchProjects();
        let currentProject = projects.filter((p) => p.id === parseInt(this.projectid))[0];

        this.innerHTML = `
            <a href="#">Tillbaka</a>
            <h1>${currentProject.name}</h1>
            <p>Ansvarig: ${currentProject.responsible}</p>
            <p>${currentProject.description}</p>
            <map-component projectid="${this.projectid}"></map-component>
            <camera-component projectid="${this.projectid}"></camera-component>
            `;
    }
}



