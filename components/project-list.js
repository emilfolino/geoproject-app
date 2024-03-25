export default class ProjectList extends HTMLElement {
    constructor() {
        super();

        this.projects = [];
    }


    // connect component
    async connectedCallback() {
        try {
            const response = await fetch("http://localhost:8866/projects");


            const result = await response.json();

            this.projects = result.data;

            this.render();
        } catch (error) {
            this.errorView();
        }
    }

    render() {
        const list = this.projects.map((p) => {
            return `<p>${p.name} - ${p.responsible}</p>`;
        }).join("\n");

        this.innerHTML = list;
    }

    errorView() {
        this.innerHTML = `<p>Could not load projects.</p>`;
    }
}
