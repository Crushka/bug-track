const codeForm = document.querySelector("#code-form");

codeForm?.addEventListener("submit", (event) => {

    event.preventDefault();
    window.location.href = "../main-page-develop/index.html";
});
