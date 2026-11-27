const ticketForm = document.querySelector("#create-ticket-form");
const titleInput = document.querySelector("#ticket-title");
const descriptionInput = document.querySelector("#ticket-description");
const priorityInput = document.querySelector("#ticket-priority");
const deadlineInput = document.querySelector("#ticket-deadline");
const deadlineCaption = document.querySelector("#ticket-deadline-caption");
const stepList = document.querySelector("#ticket-step-list");
const stepInput = document.querySelector("#ticket-step");
const stepEditor = document.querySelector("#ticket-step-editor");
const openStepEditor = document.querySelector("#open-step-editor");
const fileList = document.querySelector("#ticket-file-list");
const filesInput = document.querySelector("#ticket-files");
const fileError = document.querySelector("#ticket-file-error");
const chipTemplate = document.querySelector("#ticket-chip-template");
const formError = document.querySelector("#ticket-form-error");

function appendChip(list, name, removeLabel) {
    const chip = chipTemplate.content.firstElementChild.cloneNode(true);
    chip.dataset.value = name;
    chip.querySelector("span").textContent = name;

    const removeButton = chip.querySelector("button");
    removeButton.setAttribute("aria-label", `${removeLabel} ${name}`);
    removeButton.addEventListener("click", () => chip.remove());
    list.append(chip);
}

function toggleStepEditor(isOpen) {
    stepEditor.hidden = !isOpen;
    openStepEditor.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) stepInput.focus();
}

function addStep() {
    const name = stepInput.value.trim();
    if (!name) return;

    appendChip(stepList, name, "Удалить шаг");
    stepInput.value = "";
    formError.textContent = "";
    toggleStepEditor(false);
    openStepEditor.focus();
}

openStepEditor.addEventListener("click", () => toggleStepEditor(stepEditor.hidden));
document.querySelector("#confirm-step").addEventListener("click", addStep);
stepInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        addStep();
    }
});

document.querySelector("#attach-ticket-files").addEventListener("click", () => filesInput.click());
filesInput.addEventListener("change", () => {
    let hasUnsupportedFiles = false;

    for (const file of filesInput.files) {
        if (file.type.startsWith("image/") || /\.txt$/i.test(file.name)) {
            appendChip(fileList, file.name, "Удалить файл");
        } else {
            hasUnsupportedFiles = true;
        }
    }

    fileError.textContent = hasUnsupportedFiles ? "Можно прикреплять только изображения и файлы .txt." : "";
    filesInput.value = "";
});

function openDeadlinePicker(event) {
    if (typeof deadlineInput.showPicker !== "function") return;
    deadlineInput.focus();

    try {
        deadlineInput.showPicker();
        event.preventDefault();
    } catch {
    }
}

deadlineInput.addEventListener("click", openDeadlinePicker);
deadlineInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openDeadlinePicker(event);
});
deadlineInput.addEventListener("input", () => {
    deadlineCaption.textContent = deadlineInput.value
        ? deadlineInput.value.split("-").reverse().join(".")
        : "Выбрать дедлайн";
});

function chipValues(list) {
    return Array.from(list.children, (chip) => chip.dataset.value);
}

ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.textContent = "";

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) {
        formError.textContent = "Заполните название и описание бага.";
        (title ? descriptionInput : titleInput).focus();
        return;
    }

    addStep();
    const steps = chipValues(stepList);
    if (steps.length === 0) {
        formError.textContent = "Добавьте хотя бы один шаг воспроизведения.";
        toggleStepEditor(true);
        return;
    }

    try {
        saveDemoProjectTicket({
            title,
            description,
            steps,
            priority: Number(priorityInput.value),
            deadline: deadlineInput.value,
            attachments: chipValues(fileList),
        });
    } catch {
        formError.textContent = "Не удалось сохранить тикет в текущей вкладке.";
        return;
    }

    window.location.assign(ticketForm.action);
});
