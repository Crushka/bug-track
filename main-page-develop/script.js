const chatForm = document.querySelector("#chat-input");
const messageInput = document.querySelector("#message");
const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#chat-message-template");
const currentUserName = document.querySelector("#user-info > p");
const attachButton = document.querySelector("#attach-btn");
const fileInput = document.querySelector("#chat-files");
const attachmentPreview = document.querySelector("#chat-attachments");
const attachmentNames = document.querySelector("#chat-file-names");
const attachmentError = document.querySelector("#chat-file-error");
const clearFilesButton = document.querySelector("#clear-chat-files");

let selectedFiles = [];

function renderSelectedFiles() {
    const names = selectedFiles.map((file) => file.name).join(", ");
    attachmentPreview.hidden = selectedFiles.length === 0;
    attachmentNames.textContent = names;
    attachmentNames.title = names;
}

function isSupportedAttachment(file) {
    return file.type.startsWith("image/")
        || file.type === "text/plain"
        || (!file.type && /\.txt$/i.test(file.name));
}

attachButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);
    selectedFiles = files.filter(isSupportedAttachment);
    attachmentError.textContent = selectedFiles.length === files.length
        ? ""
        : "Можно прикреплять только изображения и обычные текстовые файлы.";
    fileInput.value = "";
    renderSelectedFiles();
});

clearFilesButton.addEventListener("click", () => {
    selectedFiles = [];
    attachmentError.textContent = "";
    renderSelectedFiles();
    attachButton.focus();
});

function resizeMessageInput() {
    const isAtBottom = messages.scrollHeight - messages.clientHeight - messages.scrollTop <= 1;
    messageInput.style.height = "";
    messageInput.style.height = `${messageInput.scrollHeight}px`;

    if (isAtBottom) {
        messages.scrollTop = messages.scrollHeight;
    }
}

messageInput.addEventListener("input", resizeMessageInput);

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const messageText = messageInput.value.trim();

    if (!messageText && selectedFiles.length === 0) {
        messageInput.focus();
        return;
    }

    const message = messageTemplate.content.firstElementChild.cloneNode(true);
    message.querySelector(".chat-message-author").textContent = currentUserName.textContent.trim() || "Вы";
    const textContent = message.querySelector(".chat-message-text");
    textContent.textContent = messageText;
    textContent.hidden = !messageText;

    const fileList = message.querySelector(".chat-message-files");
    for (const file of selectedFiles) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.textContent = file.name;
        item.append(link);
        fileList.append(item);
    }
    fileList.hidden = selectedFiles.length === 0;
    messages.append(message);

    messageInput.value = "";
    selectedFiles = [];
    attachmentError.textContent = "";
    renderSelectedFiles();
    resizeMessageInput();
    messages.scrollTop = messages.scrollHeight;
    messageInput.focus();
});
