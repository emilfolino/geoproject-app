import auth from "../models/auth.js";

export default class LoginForm extends HTMLElement {
    constructor() {
        super();

        this.user = {};
    }

    connectedCallback() {
        this.innerHTML = `
            <h1>Logga in</h1>
            <form action="" id="login-form">
                <label>E-post</label>
                <input type="email" id="email-input" required="required">

                <label>Lösenord</label>
                <input type="password" id="password-input" required="required">

                <input type="submit" class="button" value="Logga in">
            </form>
        `;

        this.init();
    }

    init() {
        const loginFormElement = document.getElementById("login-form");
        const emailInputElement = document.getElementById("email-input");
        const passwordInputElement = document.getElementById("password-input");

        loginFormElement.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (this.user.email && this.user.password) {
                let result = await auth.login(this.user);

                if (result === "ok") {
                    location.hash = "";
                }
            }
        });

        emailInputElement.addEventListener("input", async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.email = event.target.value;
        });

        passwordInputElement.addEventListener("input", async (event) => {
            this.user = {
                ...this.user,
            };

            this.user.password = event.target.value;
        });
    }
}
