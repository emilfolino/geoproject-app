import auth from "../models/auth.js";

export default class ProjectsView extends HTMLElement {
    connectedCallback() {
        let flashMessage = "";
        if (auth.flash) {
            flashMessage = auth.flash;

            auth.flash = "";
        }

        let button = `<a href="#new-project" class="button">Skapa ett nytt projekt</a>`;

        if (!auth.token) {
            button = `<a href="#login" class="button">Logga in</a>`;
        }

        this.innerHTML = `<h1>GeoProject</h1>

        <p>${flashMessage}</p>

        <p>${button}</p>

        <p>Här listas projekten:</p>

        <project-list></project-list>`;
    }
}



