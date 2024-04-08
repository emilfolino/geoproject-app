export default class Router extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = "";

        this.allRoutes = {
            "": {
                view: "<projects-view></projects-view>",
                name: "Projekt",
            },
            "project\/(\\d+)": {
                view: `<project-view projectid="$$"></project-view>`,
                name: "Enskild projekt",
            }
        };
    }

    get routes() {
        return this.allRoutes;
    }

    // connect component
    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });

        this.resolveRoute();
    }

    resolveRoute() {
        this.currentRoute = location.hash.replace("#", "");

        this.render();
    }

    render() {
        let output = "<not-found></not-found>";

        for (let route in this.routes) {
            let re = new RegExp(`^${route}$`);

            let matches = this.currentRoute.match(re);

            if (matches) {
                if (matches[1]) {
                    output = this.routes[route].view.replace("$$", matches[1]);
                } else {
                    output = this.routes[route].view;
                }
            }
        }

        this.innerHTML = output;
    }
}
