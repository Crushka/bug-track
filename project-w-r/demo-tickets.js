const demoProjectTicketsKey = "bugtrack:profile-project:demo-tickets";

function getDemoProjectTickets() {
    try {
        const tickets = JSON.parse(sessionStorage.getItem(demoProjectTicketsKey) || "[]");
        return Array.isArray(tickets) ? tickets : [];
    } catch {
        return [];
    }
}

function saveDemoProjectTicket(ticket) {
    sessionStorage.setItem(demoProjectTicketsKey, JSON.stringify([...getDemoProjectTickets(), ticket]));
}
