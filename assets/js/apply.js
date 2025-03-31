document.addEventListener("DOMContentLoaded", function () {
    initializeTable();

    const technologyHeading = document.getElementById("technology-heading");
    const innovationHeading = document.getElementById("innovation-heading");
    const ecologyHeading = document.getElementById("ecology-heading");

    technologyHeading.style.backgroundColor = "white";
    technologyHeading.style.color = "var(--text)";
    innovationHeading.style.backgroundColor = "var(--primary)";
    ecologyHeading.style.backgroundColor = "var(--primary)";

    setupZoneHeadings();
    setupRankButtons();
    setupSubmitAndClear();
    updateLastChangeTime();
});

function initializeTable() {
    const tbody = document.querySelector(".resulting-block table tbody");
    tbody.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 3; j++) {
            const cell = document.createElement("td");
            if (j === 2) {
                cell.textContent = i;
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    document.querySelector(
        ".resulting-block h4:last-of-type"
    ).textContent = `Total Number of Companies Applied: 0`;
}

function setupZoneHeadings() {
    const headings = {
        "technology-heading": ".technology-zone",
        "innovation-heading": ".innovation-zone",
        "ecology-heading": ".ecology-zone",
    };

    for (const [headerId, zoneClass] of Object.entries(headings)) {
        document.getElementById(headerId).onclick = () => {
            const zones = document.querySelectorAll(".technology-zone, .innovation-zone, .ecology-zone");

            for (let i = 0; i < zones.length; i++) {
                zones[i].style.display = "none";
            }

            document.querySelector(zoneClass).style.display = "block";

            updateHeadingStyles(headerId);
        };
    }
}

function updateHeadingStyles(activeHeaderId) {
    const headings = ["technology-heading", "innovation-heading", "ecology-heading"];
    for (let i = 0; i < headings.length; i++) {
        const header = document.getElementById(headings[i]);
        if (headings[i] === activeHeaderId) {
            header.style.backgroundColor = "white";
            header.style.color = "var(--text)";
        } else {
            header.style.backgroundColor = "var(--primary)";
            header.style.color = "white";
        }
    }
}

function setupRankButtons() {
    var rankButtons = document.querySelectorAll(".rank-button");
    for (var i = 0; i < rankButtons.length; i++) {
        rankButtons[i].onclick = function (e) {
            e.preventDefault();
            const form = this.closest("form");
            const rank = form.querySelector('input[type="number"]').value;
            const company = form.querySelector("label").textContent;
            const zone = getZoneFromForm(form);

            handleRankSelection(rank, company, zone);
        };
    }
}

function getZoneFromForm(form) {
    if (form.closest(".technology-zone")) return "Technology Zone";
    if (form.closest(".innovation-zone")) return "Innovation Zone";
    if (form.closest(".ecology-zone")) return "Ecology Zone";
    return "";
}

function handleRankSelection(rank, company, zone) {
    if (!rank || !Number.isInteger(Number(rank))) {
        alert("Please enter the rank of the chosen company.");
        return;
    }

    if (parseInt(rank) < 1 || parseInt(rank) > 10) {
        alert("Please enter the rank of the chosen company between 1 and 10.");
        return;
    }

    if (isCompanyDuplicate(company)) {
        alert("You have already chosen this company.");
        return;
    }

    if (isRankDuplicate(rank)) {
        alert("You have already chosen this rank.");
        return;
    }

    const tbody = document.querySelector(".resulting-block table tbody");

    for (const row of tbody.children) {
        if (row.children[2].textContent === rank) {
            row.children[0].textContent = zone;
            row.children[1].textContent = company;
        }
    }

    updateTable();
    alert(
        `You have successfully selected ${company} as your
    ${getOrdinal(parseInt(rank))} company in ${zone}.`
    );
}

function isCompanyDuplicate(company) {
    const tbody = document.querySelector("table tbody");

    for (const row of tbody.rows) {
        const cells = row.querySelectorAll("td");
        if (cells[1].textContent.trim() === company) {
            return true;
        }
    }

    return false;
}

function isRankDuplicate(rank) {
    const tbody = document.querySelector("table tbody");

    for (const row of tbody.rows) {
        const cells = row.querySelectorAll("td");

        if (
            cells[0].textContent.trim() !== "" &&
            cells[1].textContent.trim() !== "" &&
            cells[2].textContent.trim() === rank
        ) {
            return true;
        }
    }

    return false;
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function updateTable() {
    const rows = document.querySelectorAll(".resulting-block table tbody tr");

    let count = 0;
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        if (
            cells[0].textContent.trim() !== "" &&
            cells[1].textContent.trim() !== "" &&
            cells[2].textContent.trim() !== ""
        ) {
            count++;
        }
    });

    document.querySelector(
        ".resulting-block h4:last-of-type"
    ).textContent = `Total Number of Companies Applied: ${count}`;

    updateLastChangeTime();
}

function updateLastChangeTime() {
    const now = new Date();
    let timeString = now.toLocaleString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    timeString = timeString.replace(/, /g, " ");

    const timeZone = "GMT+0800 (China Standard Time)";
    timeString = `Last change time: ${timeString} ${timeZone}`;

    document.querySelector(".resulting-block h4:first-of-type").textContent = timeString;
}

function setupSubmitAndClear() {
    document.querySelector('input[type="submit"]').parentElement.addEventListener("click", function (e) {
        e.preventDefault();
        handleSubmission();
    });

    document.querySelector('input[type="reset"]').parentElement.addEventListener("click", function (e) {
        e.preventDefault();
        clearTable();
    });
}

function handleSubmission() {
    const time = document.querySelector(".resulting-block h4:first-of-type").textContent.slice(17);

    if (
        document.querySelector(".resulting-block h4:last-of-type").textContent ===
        `Total Number of Companies Applied: 0`
    ) {
        showMessage("You have not chosen any company.", true);
        return;
    }

    if (checkForGaps()) {
        return;
    }

    showMessage(`You have successfully submitted your application at time ${time}`, false);
}

function showMessage(message, isError) {
    let messageElement = document.querySelector(".submission-message");
    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.className = "submission-message";
        document.querySelector(".resulting-block").appendChild(messageElement);
    }
    if (isError) {
        messageElement.style.color = "red";
    }
    messageElement.textContent = message;
}

function checkForGaps() {
    const tbody = document.querySelector(".resulting-block table tbody");
    const rows = Array.from(tbody.rows);

    let lastFilledIndex = -1;
    for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].children[1].textContent.trim() !== "") {
            lastFilledIndex = i;
            break;
        }
    }

    if (lastFilledIndex === -1) {
        return false;
    }

    let gaps = [];
    for (let i = 0; i <= lastFilledIndex; i++) {
        if (rows[i].children[1].textContent.trim() === "") {
            gaps.push(parseInt(rows[i].children[2].textContent));
        }
    }

    if (gaps.length > 0) {
        const gapOrdinals = gaps.map((num) => getOrdinal(num));
        const stringOfGapOrdinals = gapOrdinals.join(", ");
        const message = `You have not chosen your ${stringOfGapOrdinals}
        chosen ${gaps.length === 1 ? "company" : "companies"},
        you can not leave any gap between your chosen companies.`;

        showMessage(message, true);

        return true;
    }

    return false;
}

function clearTable() {
    const tbody = document.querySelector(".resulting-block table tbody");
    tbody.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 3; j++) {
            const cell = document.createElement("td");
            if (j === 2) {
                cell.textContent = i;
            }
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    updateTable();

    document.querySelector(
        ".resulting-block h4:last-of-type"
    ).textContent = `Total Number of Companies Applied: 0`;

    document.querySelector(".submission-message").remove();
}
