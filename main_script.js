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

const setAccountIcon = (mount) => {
    const button = mount.querySelector("#user-icon");
    const icons = mount.querySelector("#account-avatars")?.content;
    if (!button || !icons) return;

    const defaultIconId = "developer-icon";
    const iconId = mount.dataset.accountIcon || defaultIconId;
    const icon = icons.getElementById(iconId) || icons.getElementById(defaultIconId);

    if (icon) button.replaceChildren(icon.cloneNode(true));
};

const loadSharedComponent = (mountSelector, fileName, toggleSelector, panelSelector, prepareMount) => {
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
            prepareMount?.(mount);
            initializePanel(mount, toggleSelector, panelSelector);
        })
        .catch((error) => console.error(error));
};

loadSharedComponent("#account-mount", "account.html", "#user-icon", "#account-manage", setAccountIcon);
loadSharedComponent("#notifications-mount", "notifications.html", "#notification-btn", "#notification-box");
