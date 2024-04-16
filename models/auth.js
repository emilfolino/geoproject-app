const auth = {
    token: "",
    flash: "",
    email: "",

    login: async function login(user) {
        try {
            const response = await fetch("http://localhost:8866/login", {
                body: JSON.stringify(user),
                headers: {
                'content-type': 'application/json'
                },
                method: 'POST'
            });

            if (response.status !== 200) {
                return "not ok";
            }

            const result = await response.json();

            auth.token = result.data.token;
            auth.email = result.data.user.email;

            return "ok";
        } catch (error) {

        }


    }
};

export default auth;
