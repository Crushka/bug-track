const captain = {
    id: "captain",
    name: "Пользователь",
    reservation: "Зарезервировано: Пользователь",
    tickets: [
        ["Список тикетов пуст", "После смены проекта тикеты видны только после перезагрузки."],
        ["Код не копируется", "Кнопка копирования не добавляет код приглашения в буфер."],
        ["Пропадает описание", "После сохранения правок описание тикета становится пустым."],
        ["Сбрасывается сортировка", "После возврата к списку тикеты снова отсортированы по дате."],
    ],
};

const teamMembers = [
    {
        id: "me",
        name: "Вы",
        reservation: "Зарезервировано вами",
        tickets: [
            ["Дубли сообщений", "При двойном клике сообщение появляется дважды."],
            ["Сброс фильтра", "При возврате к списку тикетов выбранный фильтр сбрасывается."],
            ["Пустой список тикетов", "После смены проекта тикеты появляются только после перезагрузки."],
            ["Текст выходит за край", "Длинное название без пробелов не помещается в карточке."],
            ["Не скачивается вложение", "Ссылка на файл в чате перестаёт работать после перезагрузки."],
        ],
    },
    {
        id: "developer",
        name: "Пользователь",
        reservation: "Зарезервировано: Пользователь",
        tickets: [
            ["Счётчик уведомлений", "После прочтения уведомления счётчик не уменьшается."],
            ["Дата на день раньше", "В карточке тикета показывается предыдущий день вместо даты создания."],
            ["Пропадает черновик", "Набранный текст чата теряется при переходе в настройки команды."],
            ["Не виден новый участник", "Список команды не обновляется после принятия приглашения."],
        ],
    },
];

const freeTickets = [
    ["Дата на день раньше", "В карточке тикета дата создания отображается на день раньше."],
    ["Пропадает описание", "После сохранения правок описание тикета становится пустым."],
    ["Счётчик уведомлений", "После прочтения уведомления счётчик не уменьшается."],
    ["Не сохраняется приоритет", "После обновления страницы у тикета снова стоит прежний приоритет."],
];

function appendTickets(list, tickets, reservation) {
    for (const [name, description] of tickets) {
        const card = document.createElement("li");
        card.className = "team-ticket";

        const heading = document.createElement("div");
        const title = document.createElement("p");
        title.className = "team-ticket-title";
        title.textContent = name;
        const owner = document.createElement("p");
        owner.className = "team-ticket-owner";
        owner.textContent = reservation;
        heading.append(title, owner);

        const summary = document.createElement("p");
        summary.className = "team-ticket-description";
        summary.textContent = description;
        card.append(heading, summary);
        list.append(card);
    }
}

const memberTemplate = document.querySelector("#team-member-template");

if (memberTemplate) {
    function renderMember(member) {
        const block = memberTemplate.content.firstElementChild.cloneNode(true);
        block.querySelector(".team-member-name").textContent = member.name;
        block.querySelector(".ticket-more").href = `tickets.html?member=${encodeURIComponent(member.id)}`;
        appendTickets(block.querySelector(".team-ticket-grid"), member.tickets.slice(0, 3), member.reservation);
        return block;
    }

    document.querySelector("#captain-member").append(renderMember(captain));
    document.querySelector("#team-members-list").append(...teamMembers.map(renderMember));
}

const ticketList = document.querySelector("#member-tickets");

function renderTicketPage(ticketList) {
    const params = new URLSearchParams(window.location.search);

    if (params.get("from") === "developer") {
        const backLink = document.querySelector("#tickets-back");
        const url = new URL("../main-page-develop/index.html", window.location.href);
        const chatId = params.get("chatId");
        if (chatId) url.searchParams.set("chatId", chatId);
        backLink.href = url.href;
        backLink.querySelector("span").textContent = "Назад на главную";
    }

    if (params.get("scope") === "free") {
        document.title = "Свободные багтикеты — BugTrack";
        document.querySelector("#member-tickets-title").textContent = "Свободные багтикеты";
        ticketList.setAttribute("aria-label", "Все свободные багтикеты");
        appendTickets(ticketList, freeTickets, "Не назначен");
        return;
    }

    const memberId = params.get("member");
    const member = [captain, ...teamMembers].find(({ id }) => id === memberId);

    if (member) {
        const owner = document.querySelector("#member-tickets-owner");
        owner.textContent = member.id === captain.id ? `${member.name} · Капитан команды` : member.name;
        owner.hidden = false;
        appendTickets(ticketList, member.tickets, member.reservation);
    } else {
        ticketList.hidden = true;
        document.querySelector("#member-tickets-empty").hidden = false;
    }
}

if (ticketList) renderTicketPage(ticketList);
