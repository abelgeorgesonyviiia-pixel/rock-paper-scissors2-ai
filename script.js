let model;
let webcam;
let labelContainer;

const computerChoices = [
  "Rock",
  "Paper",
  "Scissors"
];

async function init() {

  const URL = "./model/";

  model = await tmImage.load(
    URL + "model.json",
    URL + "metadata.json"
  );

  webcam = new tmImage.Webcam(
    350,
    350,
    true
  );

  await webcam.setup();

  await webcam.play();

  window.requestAnimationFrame(loop);

  document.getElementById(
    "webcam-container"
  ).innerHTML = "";

  document.getElementById(
    "webcam-container"
  ).appendChild(
    webcam.canvas
  );

  labelContainer =
    document.getElementById(
      "label-container"
    );
}

async function loop() {

  webcam.update();

  await predict();

  window.requestAnimationFrame(loop);

}

async function predict() {

  const prediction =
    await model.predict(
      webcam.canvas
    );

  let highest = 0;

  let player = "";

  for (
    let i = 0;
    i < prediction.length;
    i++
  ) {

    if (
      prediction[i].probability >
      highest
    ) {

      highest =
      prediction[i].probability;

      player =
      prediction[i].className;

    }

  }

  if (highest < 0.90) {

    labelContainer.innerHTML =
      "Show Rock, Paper or Scissors";

    return;

  }

  const computer =
    computerChoices[
      Math.floor(
        Math.random() * 3
      )
    ];

  let result = "";

  if (player === computer) {

    result = "🤝 Draw";

  }

  else if (

    (player === "Rock" &&
     computer === "Scissors")

    ||

    (player === "Paper" &&
     computer === "Rock")

    ||

    (player === "Scissors" &&
     computer === "Paper")

  ) {

    result = "🎉 You Win";

  }

  else {

    result = "💻 Computer Wins";

  }

  labelContainer.innerHTML = `

  <h2>You : ${player}</h2>

  <h2>Computer : ${computer}</h2>

  <h1>${result}</h1>

  `;
}
