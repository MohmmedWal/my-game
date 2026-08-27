
const img = document.querySelector(".clickTest");
const failSound = document.querySelector(".failSound");
const win = document.querySelector(".win");
const fail = document.querySelector(".fail");
const body = document.querySelector("body");
let wen_emoge =
    window.onclick = (e) => {
        if (e.target.classList.contains("clickTest")) {


            confetti({
                particleCount: 30,
                angle: 45,
                spread: 15,
                startVelocity: 100,
                origin: { x: 0, y: 0 }
            });

            confetti({
                particleCount: 30,
                angle: 135,
                spread: 15,
                startVelocity: 100,
                origin: { x: 1, y: 0 }
            });

            confetti({
                particleCount: 30,
                angle: 45,
                spread: 15,
                startVelocity: 100,
                origin: { x: 0, y: 1 }
            });

            confetti({
                particleCount: 30,
                angle: 135,
                spread: 15,
                startVelocity: 100,
                origin: { x: 1, y: 1 }
            });
            win.classList.remove("hidden");

            setTimeout(() => {
                win.classList.add("hidden");
            }, 4000);
            let wid = Math.floor((Math.random() * (window.innerWidth - 100)));
            let hie = Math.floor((Math.random() * (window.innerHeight - 100)));
            console.log("wid " + wid + " hie " + hie);
            img.style.top = `${hie}px`;
            img.style.left = (`${wid}px`);
            body.classList.add("bg-indigo-950");
            setTimeout(() => {
                body.classList.remove("bg-indigo-950");
            }, 4000);

        }
        else {
            fail.classList.remove("hidden");

            failSound.currentTime = 0;
            failSound.play();
            body.classList.add("bg-red-400")
            failSound.play;

            setTimeout(() => {
                fail.classList.add("hidden");
                body.classList.remove("bg-red-400")
                failSound.pause();
            }, 3000);

        }
    }




