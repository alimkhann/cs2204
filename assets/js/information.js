const promotionalTextMessages = [
    "Join  our  company  in Technology Zone of Visionary Innovation Hub for unparalleled opportunities in cutting-edge tech development! 15 QUOTAS LEFT!",
    "Become part of the Innovation Zone at  Visionary Innovation Hub, where creativity meets research for  groundbreaking solutions! 10 QUOTAS LEFT!",
    "Discover  the  Eco  Zone  at  Visionary  Innovation  Hub,  dedicated  to  sustainable practices  and technologies  for a greener future! 12 QUOTAS LEFT!",
];

function getRandomPromotionalTextMessage() {
    const promotionText = document.querySelector(".promotion-information-block h4");
    const randomIndex = Math.floor(Math.random() * promotionalTextMessages.length);
    promotionText.textContent = promotionalTextMessages[randomIndex];
}

function switchVideo() {
    const videoElement = document.querySelector("video");
    const currentSrc = videoElement.querySelector("source").src;
    const video1 = "https://personal.cs.cityu.edu.hk/~cs2204/2024/video/video1.mp4";
    const video2 = "https://personal.cs.cityu.edu.hk/~cs2204/2024/video/video2.mp4";

    const newSrc = currentSrc.includes("video1") ? video2 : video1;

    videoElement.innerHTML = `
        <source src="${newSrc}" type="video/mp4">
        <source src="${newSrc.replace(".mp4", ".webm")}" type="video/webm">
        <h4>Your browser does not support this video format</h4>
    `;

    videoElement.load();
    videoElement.play();
}

window.onload = () => {
    getRandomPromotionalTextMessage();
    setInterval(getRandomPromotionalTextMessage, 3000);

    const videoElement = document.querySelector("video");
    videoElement.addEventListener("ended", switchVideo);
};
