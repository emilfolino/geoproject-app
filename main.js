import Router from "./router.js";

import ProjectsView from "./views/projects-view.js";
import ProjectView from "./views/project-view.js";

import ProjectList from "./components/project-list.js";
import NewProject from "./components/new-project.js";
import LoginForm from "./components/login-form.js";

customElements.define("router-outlet", Router);

customElements.define("projects-view", ProjectsView);
customElements.define("project-view", ProjectView);

customElements.define("project-list", ProjectList);
customElements.define("new-project", NewProject);
customElements.define("login-form", LoginForm);

