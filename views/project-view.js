import projectModel from "../models/project.js";

export default class ProjectView extends HTMLElement {
    constructor() {
        super();

        this.projectid = "";
        this.cameraElement = null;
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
            <div class="extra-padding"><a href="#">Tillbaka</a>
            <h1>${currentProject.name}</h1>
            <p>Ansvarig: ${currentProject.responsible}</p>
            <p>${currentProject.description}</p>
            <button class="button" id="show-camera">Ta en bild</button></div>
            <map-component projectid="${this.projectid}"></map-component>
            `;

        this.init();
    }

    init() {
        const showCamera = document.getElementById("show-camera");

        showCamera.addEventListener("click", () => {
            this.renderCameraComponent();
        });
    }

    renderCameraComponent() {
        this.cameraElement = document.createElement("camera-component");
        this.cameraElement.setAttribute("projectid", this.projectid);

        this.append(this.cameraElement);
    }
}





