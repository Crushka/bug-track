const notificationsMount = document.querySelector("#notifications-mount");
const currentScript = document.currentScript;

const initializeNotifications = (mount) => {
    const notificationButton = mount.querySelector("#notification-btn");
    const notificationBox = mount.querySelector("#notification-box");

    if (!notificationButton || !notificationBox) return;

    const setNotificationsOpen = (isOpen) => {
        notificationBox.classList.toggle("is-open", isOpen);
        notificationBox.setAttribute("aria-hidden", String(!isOpen));
        notificationBox.inert = !isOpen;
        notificationButton.setAttribute("aria-expanded", String(isOpen));
    };

    const closeNotifications = () => setNotificationsOpen(false);

    notificationButton.addEventListener("click", () => {
        const isOpen = notificationBox.classList.contains("is-open");
        setNotificationsOpen(!isOpen);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideBox = notificationBox.contains(event.target);
        const clickedButton = notificationButton.contains(event.target);

        if (notificationBox.classList.contains("is-open") && !clickedInsideBox && !clickedButton) {
            closeNotifications();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && notificationBox.classList.contains("is-open")) {
            closeNotifications();
            notificationButton.focus();
        }
    });
};

if (notificationsMount && currentScript) {
    const notificationsUrl = new URL("notifications.html", currentScript.src);

    fetch(notificationsUrl, { cache: "no-store" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load notifications: ${response.status}`);
            }

            return response.text();
        })
        .then((markup) => {
            notificationsMount.innerHTML = markup;
            initializeNotifications(notificationsMount);
        })
        .catch((error) => console.error(error));
}
