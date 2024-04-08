export default class ProjectsView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h1>GeoProject</h1>

        <p><a href="#new-project" class="button">Skapa ett ny projekt</a></p>

        <p>Här listas projekten:</p>

        <project-list></project-list>`;
    }
}



