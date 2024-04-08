const project = {
    projects: [],

    fetchProjects: async function fetchProjects() {
        if (!project.projects.length) {
            const response = await fetch("http://localhost:8866/projects");
            const result = await response.json();

            project.projects = result.data;
        }

        return project.projects;
    },
};

export default project;
