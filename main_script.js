const currentScript = document.currentScript;

const initializePanel = (mount, toggleSelector, panelSelector) => {
    const toggle = mount.querySelector(toggleSelector);
    const panel = mount.querySelector(panelSelector);

    if (!toggle || !panel) return;

    const setPanelOpen = (isOpen) => {
        panel.classList.toggle("is-open", isOpen);
        panel.setAttribute("aria-hidden", String(!isOpen));
        panel.inert = !isOpen;
        toggle.setAttribute("aria-expanded", String(isOpen));
    };

    const closePanel = () => setPanelOpen(false);

    toggle.addEventListener("click", () => {
        const isOpen = panel.classList.contains("is-open");
        setPanelOpen(!isOpen);
    });

    document.addEventListener("click", (event) => {
        const clickedInsidePanel = panel.contains(event.target);
        const clickedToggle = toggle.contains(event.target);

        if (panel.classList.contains("is-open") && !clickedInsidePanel && !clickedToggle) {
            closePanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && panel.classList.contains("is-open")) {
            closePanel();
            toggle.focus();
        }
    });
};

const loadSharedComponent = (mountSelector, fileName, toggleSelector, panelSelector) => {
    const mount = document.querySelector(mountSelector);
    if (!mount || !currentScript) return;

    const componentUrl = new URL(fileName, currentScript.src);
    componentUrl.searchParams.set("refresh", Date.now().toString());

    fetch(componentUrl, { cache: "no-store" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load ${fileName}: ${response.status}`);
            }

            return response.text();
        })
        .then((markup) => {
            mount.innerHTML = markup;
            initializePanel(mount, toggleSelector, panelSelector);
        })
        .catch((error) => console.error(error));
};

loadSharedComponent("#account-mount", "account.html", "#user-icon", "#account-manage");
loadSharedComponent("#notifications-mount", "notifications.html", "#notification-btn", "#notification-box");

async function loadUserProfile() {
    const nameElement = document.querySelector("#user-name");
    const roleElement = document.querySelector("#user-role");

    if (!nameElement || !roleElement) {
        return;
    }

    const roleNames = new Map([
        ["Developer", "Разработчик"],
        ["QA", "Тестировщик"]
    ]);

    try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (response.status === 401) {
            window.location.replace("/autoriztion/autorization.html");
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const profile = await response.json();
        nameElement.textContent = profile.name;
        roleElement.textContent = roleNames.get(profile.role) ?? profile.role;
    } catch {
        nameElement.textContent = "Не удалось загрузить профиль";
        roleElement.textContent = "";
    }
}

loadUserProfile();