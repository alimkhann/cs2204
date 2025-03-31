document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const buttons = document.querySelector(".buttons");

    function showMessage(message, isError = true) {
        clearMessages();

        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? "red" : "green";
        messageDiv.style.textAlign = "center";
        messageDiv.style.marginBottom = "24px";
        messageDiv.style.marginTop = "18px";
        messageDiv.style.paddingBottom = "8px";
        messageDiv.style.paddingTop = "8px";
        messageDiv.style.background = "var(--secondary)";
        messageDiv.style.borderRadius = "8px";
        messageDiv.className = "message";

        buttons.classList.add("has-message");

        buttons.parentNode.insertBefore(messageDiv, buttons);
    }

    function clearMessages() {
        const existingMessages = document.querySelectorAll(".message");
        for (let i = 0; i < existingMessages.length; i++) {
            existingMessages[i].remove();
        }
        buttons.classList.remove("has-message");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const date = document.getElementById("reservation-date").value.trim();
        const time = document.getElementById("reservation-time").value.trim();
        const visitors = document.getElementById("number-of-visitors").value.trim();

        if (!date || !time || !visitors) {
            showMessage("Data not completed; please re-enter");
            return;
        }

        const visitorNum = parseInt(visitors);
        if (isNaN(visitorNum) || visitorNum < 1 || visitorNum !== Number(visitors)) {
            showMessage("Please enter a valid number of people!");
            return;
        }

        const result = reserve(date, time, visitorNum);
        alert(result ? "Your reservation is successful!" : "Sorry, the reservation is full!", !result);
    });

    form.addEventListener("reset", () => {
        clearMessages();
    });
});
