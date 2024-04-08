export default class ProjectsView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h1>GeoProject</h1>

        <p>Här listas projekten:</p>

        <project-list></project-list>`;
    }
}



