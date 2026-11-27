const reservationPrompt = document.querySelector("#project-reservation-prompt");
const reservationActions = document.querySelector("#project-reservation-active");
const reserveProjectButton = document.querySelector("#reserve-project");
const leaveProjectButton = document.querySelector("#leave-project");

function setProjectReserved(isReserved, moveFocus = true) {
    reservationPrompt.hidden = isReserved;
    reservationActions.hidden = !isReserved;

    if (moveFocus) {
        const nextButton = isReserved ? leaveProjectButton : reserveProjectButton;
        nextButton.focus();
    }
}

reserveProjectButton.addEventListener("click", () => setProjectReserved(true));
leaveProjectButton.addEventListener("click", () => setProjectReserved(false));

const projectLocation = new URL(window.location.href);
if (projectLocation.searchParams.get("reserved") === "1") {
    setProjectReserved(true, false);
    projectLocation.searchParams.delete("reserved");
    history.replaceState(null, "", projectLocation);
}

const projectTicketGrid = document.querySelector(".project-ticket-grid");
for (const ticket of getDemoProjectTickets()) {
    const card = document.createElement("li");
    card.className = "project-ticket";

    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = ticket.title;
    const reservation = document.createElement("p");
    reservation.textContent = "Нет резервации";
    heading.append(title, reservation);

    const description = document.createElement("p");
    description.textContent = ticket.description;
    card.append(heading, description);
    projectTicketGrid.append(card);
}
