const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const signButton = document.querySelector("#sign-btn");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (signButton.disabled) {
        return;
    }

    const formData = new FormData(loginForm);
    loginError.textContent = "";
    signButton.disabled = true;

    try {
        const response = await fetch(loginForm.action, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                login: formData.get("login"),
                password: formData.get("password")
            })
        });

        if (response.status === 401) {
            const error = await response.json();
            loginError.textContent = error.message;
            return;
        }

        if (response.status !== 204) {
            throw new Error(`HTTP ${response.status}`);
        }

        window.location.assign("/main-page-w-team/index.html");
    } catch {
        loginError.textContent = "Не удалось выполнить вход. Попробуйте ещё раз.";
    } finally {
        signButton.disabled = false;
    }
});