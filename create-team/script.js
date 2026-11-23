const generateInviteCode = (length = 7) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }

    return result;
};

const initInviteCode = () => {
    const codeBox = document.querySelector("#code-input");
    const codeValue = document.querySelector("#code-value");
    const tooltip = document.querySelector("#copy-tooltip");

    if (!codeBox || !codeValue) return;

    const code = generateInviteCode(7);
    codeValue.textContent = code;

    let tooltipTimeout = null;

    const copyCode = async () => {
        const textToCopy = codeValue.textContent.trim();
        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        
        if (tooltip) {
            tooltip.classList.add("is-shown");
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                tooltip.classList.remove("is-shown");
            }, 1500);
        }
    };

    codeBox.addEventListener("click", copyCode);
    codeBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            copyCode();
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInviteCode);
} else {
    initInviteCode();
}
