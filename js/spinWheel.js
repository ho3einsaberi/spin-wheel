// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
  outerRadius: 170, // Set outer radius so wheel fits inside the background.
  innerRadius: 50, // Make wheel hollow so segments don't go all way to center.
  textFontSize: 24, // Set default font size for the segments.
  textFontFamily: "farsi",
  // 'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
  textAlignment: "outer", // Align text to outside of wheel.
  numSegments: 15, // Specify number of segments.
  // Define segments including colour and text.
  // drawMode: "image",
  imageOverlay: true,
  drawText: true,
  strokeStyle: "#fff",
  textStyle: "#fff",
  textFillStyle: "#fff",
  segments: [
    // font size and test colour overridden on backrupt segments.
    {
      fillStyle: "#ee1c24",
      text: "10 امتیاز",
    },
    {
      fillStyle: "#3cb878",
      text: "5 امتیاز",
    },
    {
      fillStyle: "#00aef0",
      text: "20 امتیاز",
    },
    {
      fillStyle: "#f26522",
      text: "1 امتیاز",
    },
    {
      fillStyle: "#000000",
      text: "پوچ",
      textFontSize: 26,
      textFillStyle: "#ffffff",
    },
    {
      fillStyle: "#e70697",
      text: "30 امتیاز",
    },
    {
      fillStyle: "#f0c400",
      text: "8 امتیاز",
    },
    {
      fillStyle: "#a186be",
      text: "10 امتیاز",
    },
    {
      fillStyle: "#000000",
      text: "پوچ",
      textFontSize: 26,
      textFillStyle: "#ffffff",
    },
    {
      fillStyle: "#00aef0",
      text: "3 امتیاز",
    },
    {
      fillStyle: "#ee1c24",
      text: "4 امتیاز",
    },
    {
      fillStyle: "#f6989d",
      text: "22 امتیاز",
    },
    {
      fillStyle: "#f26522",
      text: "6 امتیاز",
    },
    {
      fillStyle: "#3cb878",
      text: "2 امتیاز",
    },
    {
      fillStyle: "#000000",
      text: "پوچ",
      textFontSize: 26,
      textFillStyle: "#ffffff",
    },
  ],
  // Specify the animation to use.
  animation: {
    type: "spinToStop",
    duration: 1, // Duration in seconds.
    spins: 4, // Default number of complete spins.
    callbackFinished: alertPrize,
    callbackSound: playSound, // Function to call when the tick sound is to be triggered.
    soundTrigger: "pin", // Specify pins are to trigger the sound, the other option is 'segment'.
  },
  // Turn pins on.
  pins: {
    number: 15,
    // fillStyle: "silver",
    outerRadius: 4,
  },
});

let total = 0;
let round = 1;

// Create new image object in memory.
let loadedImg = new Image();

// Create callback to execute once the image has finished loading.
loadedImg.onload = function () {
  theWheel.wheelImage = loadedImg; // Make wheelImage equal the loaded image object.
  theWheel.draw(); // Also call draw function to render the wheel.
};

// Set the image source, once complete this will trigger the onLoad callback (above).
loadedImg.src = "../Assets/images/spinWheelBackGround.svg";

// Loads the tick audio sound in to an audio object.
let audio = new Audio("../Assets/audios/tick.mp3");
let winAudio = new Audio("../Assets/audios/win.mp3");
let lostAudio = new Audio("../Assets/audios/lost.mp3");

// This function is called when the sound is to be played.
function playSound() {
  // Stop and rewind the sound if it already happens to be playing.
  audio.pause();
  audio.currentTime = 0;

  // Play the sound.
  audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower = 1;
let wheelSpinning = false;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
  if (round === 4) {
    total = 0;
    round = 1;
  }
  document.querySelector("#spin_button").disabled = true;
  document.querySelector("#spin_button2").disabled = true;
  if ((wheelSpinning = true)) {
    resetWheel();
  }
  theWheel.animation.spins = 4;
  theWheel.startAnimation();

  wheelSpinning = true;
  round === 1
    ? (document.querySelector(".tryAgainButton").textContent = "یه بار دیگه")
    : round === 2
    ? (document.querySelector(".tryAgainButton").textContent = "دورِ آخر")
    : (document.querySelector(".tryAgainButton").textContent = "تمام");
}
function tryAgain() {
  if (round === 4) {
    const fname = document.getElementById("fname").value;
    const number = document.getElementById("number").value;

    fetch("https://expo.iran.liara.run/login-spin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: number,
        fullname: fname,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return fetch("https://expo.iran.liara.run/score-spin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: number,
            score: total,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Stats sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Remove the form from the modal
    document.querySelector(".form").innerHTML = '';
  }
  
  // Always close the modal and enable spin buttons
  document.querySelector(".modal").classList.remove("opened");
  document.querySelector("#spin_button").disabled = false;
  document.querySelector("#spin_button2").disabled = false;
}


// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
  theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
  theWheel.draw(); // Call draw to render changes to the wheel.
  wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------

function alertPrize(indicatedSegment) {
  document.querySelector(".modal").classList.add("opened");

  if (indicatedSegment.text == "پوچ") {
    lostAudio.pause();
    lostAudio.currentTime = 0;
    lostAudio.play();
    document.querySelector(".prizeTitle").textContent = "باختی!";
    document.querySelector(
      ".prizePoint"
    ).textContent = `در دایره قسمت ما نقطه تسلیمیم ...`;
    document.querySelector(".modal").style.backgroundColor = "red";
  } else {
    winAudio.pause();
    winAudio.currentTime = 0;
    winAudio.play();
    document.querySelector(".prizeTitle").textContent = "تبریک به تو!";
    document.querySelector(
      ".prizePoint"
    ).textContent = `${indicatedSegment.text} بردی`;
    document.querySelector(".modal").style.backgroundColor = "dodgerblue";
  }
  total =
    total +
    (indicatedSegment.text === "10 امتیاز"
      ? 10
      : indicatedSegment.text === "30 امتیاز"
      ? 30
      : indicatedSegment.text === "3 امتیاز"
      ? 3
      : indicatedSegment.text === "1 امتیاز"
      ? 1
      : indicatedSegment.text === "5 امتیاز"
      ? 5
      : indicatedSegment.text === "8 امتیاز"
      ? 8
      : indicatedSegment.text === "20 امتیاز"
      ? 20
      : indicatedSegment.text === "2 امتیاز"
      ? 2
      : indicatedSegment.text === "4 امتیاز"
      ? 4
      : indicatedSegment.text === "6 امتیاز"
      ? 6
      : indicatedSegment.text === "22 امتیاز"
      ? 22
      : 0);

  round++;

  if (round === 4) {
    document.querySelector(
      ".totalPoint"
    ).textContent = `امتیاز نهایی: ${total}`;
  } else {
    document.querySelector(".totalPoint").textContent = `امتیاز کل: ${total}`;
  }
  if (round === 4) {
    document.querySelector(".form").innerHTML = `<form id="infoForm">
      <label>نام:</label><br>
      <input type="text" id="fname" name="fname"><br>
      <label for="number">شماره تماس:</label><br>
      <input type="text" id="number" name="number"><br><br><br><br>
    </form>`;
  }
}
