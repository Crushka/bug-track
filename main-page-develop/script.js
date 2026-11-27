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
const sendButton = document.querySelector("#send-btn");
const sendError = document.querySelector("#chat-send-error");
const chatId = new URLSearchParams(window.location.search).get("chatId")?.trim();

if (chatId) {
    for (const link of document.querySelectorAll(".tickets-more-slot .ticket-more")) {
        const url = new URL(link.href);
        url.searchParams.set("chatId", chatId);
        link.href = url.href;
    }
}

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

async function sendMessage(chatId, message, files = []) {
    const options = { method: "POST" };

    if (files.length > 0) {
        const formData = new FormData();
        formData.append("message", message);

        for (const file of files) {
            formData.append("files", file);
        }

        options.body = formData;
    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify({ message });
    }

    const response = await fetch(`/api/chats/${encodeURIComponent(chatId)}/messages`, options)
        .catch(() => {
            throw new Error("Не удалось связаться с сервером.");
        });

    if (!response.ok) {
        throw new Error(`Не удалось отправить сообщение (${response.status}).`);
    }

    const savedMessage = await response.json().catch(() => null);
    if (!savedMessage?.id || typeof savedMessage.message !== "string" || !Array.isArray(savedMessage.attachments)) {
        throw new Error("Сервер вернул некорректный ответ на отправку сообщения.");
    }

    return savedMessage;
}

async function markMessageRead(chatId, messageId) {
    const url = `/api/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/read`;
    const response = await fetch(url, { method: "POST" });

    if (!response.ok) {
        throw new Error(`Не удалось отметить сообщение прочитанным (${response.status}).`);
    }
}

function watchIncomingMessageReads(chatId) {
    const incomingSelector = ".chat-message-row--incoming[data-message-id]";
    const pendingReads = new Set();
    const confirmedReads = new Set();

    const observer = new IntersectionObserver((entries) => {
        if (document.hidden) return;

        for (const entry of entries) {
            if (entry.isIntersecting && messages.contains(entry.target)) {
                void markVisibleMessageRead(entry.target);
            }
        }
    });

    async function markVisibleMessageRead(row) {
        const messageId = row.dataset.messageId;
        if (!messageId || pendingReads.has(messageId) || confirmedReads.has(messageId)) return;

        pendingReads.add(messageId);
        try {
            await markMessageRead(chatId, messageId);
            confirmedReads.add(messageId);
            observer.unobserve(row);
        } catch (error) {
            console.warn(error);
        } finally {
            pendingReads.delete(messageId);
        }
    }

    function observeUnreadRows() {
        observer.disconnect();
        if (document.hidden) return;

        for (const row of messages.querySelectorAll(incomingSelector)) {
            const { messageId, readAt } = row.dataset;
            if (messageId && !readAt && !confirmedReads.has(messageId)) {
                observer.observe(row);
            }
        }
    }

    new MutationObserver(observeUnreadRows).observe(messages, { childList: true });
    document.addEventListener("visibilitychange", observeUnreadRows);
    observeUnreadRows();
}

if (chatId) {
    watchIncomingMessageReads(chatId);
}

function getAttachmentUrl(downloadUrl) {
    if (typeof downloadUrl !== "string" || !downloadUrl.trim()) return null;

    try {
        const url = new URL(downloadUrl, document.baseURI);
        return ["http:", "https:", "blob:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
}

function appendMessage({ message: messageText, userLogin, attachments }) {
    const message = messageTemplate.content.firstElementChild.cloneNode(true);
    message.querySelector(".chat-message-author").textContent = userLogin || "Вы";
    const textContent = message.querySelector(".chat-message-text");
    textContent.textContent = messageText;
    textContent.hidden = !messageText;

    const fileList = message.querySelector(".chat-message-files");
    for (const attachment of attachments) {
        const item = document.createElement("li");
        const fileName = attachment?.fileName || "Вложение";
        const downloadUrl = getAttachmentUrl(attachment?.downloadUrl);

        if (downloadUrl) {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName;
            link.textContent = fileName;
            item.append(link);
        } else {
            item.textContent = fileName;
        }

        fileList.append(item);
    }
    fileList.hidden = attachments.length === 0;

    if (chatId) {
        message.querySelector(".chat-read-status").remove();
    }

    messages.append(message);
}

function setSending(isSending) {
    sendButton.disabled = isSending;
    attachButton.disabled = isSending;
    clearFilesButton.disabled = isSending;
    messageInput.readOnly = isSending;
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sendButton.disabled) return;

    const messageText = messageInput.value.trim();
    if (!messageText && selectedFiles.length === 0) {
        messageInput.focus();
        return;
    }

    sendError.textContent = "";
    setSending(true);

    try {
        const savedMessage = chatId
            ? await sendMessage(chatId, messageText, selectedFiles)
            : {
                message: messageText,
                userLogin: currentUserName?.textContent.trim(),
                attachments: selectedFiles.map((file) => ({
                    fileName: file.name,
                    downloadUrl: URL.createObjectURL(file),
                })),
            };

        appendMessage(savedMessage);
        messageInput.value = "";
        selectedFiles = [];
        attachmentError.textContent = "";
        renderSelectedFiles();
        resizeMessageInput();
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        sendError.textContent = error.message;
    } finally {
        setSending(false);
        messageInput.focus();
    }
});
