const circleDetails = [
  { id: 1, speed: 0.1, audio: ["C", 3, 2], color: "42, 0, 114" },
  { id: 2, speed: 0.2, audio: ["D", 3, 2], color: "103, 58, 183" },
  { id: 3, speed: 0.3, audio: ["E", 3, 2], color: "63, 81, 181" },
  { id: 4, speed: 0.4, audio: ["F", 3, 2], color: "33, 150, 243" },
  { id: 5, speed: 0.5, audio: ["G", 3, 2], color: "3, 169, 244" },
  { id: 6, speed: 0.6, audio: ["A", 3, 2], color: "0, 188, 212" },
  { id: 7, speed: 0.7, audio: ["B", 3, 2], color: "0, 150, 136" },
  { id: 8, speed: 0.8, audio: ["C", 4, 2], color: "76, 175, 80" },
  { id: 9, speed: 0.9, audio: ["D", 4, 2], color: "139, 195, 74" },
  { id: 10, speed: 1.0, audio: ["E", 4, 2], color: "205, 220, 57" },
  { id: 11, speed: 1.1, audio: ["F", 4, 2], color: "255, 235, 59" },
  { id: 12, speed: 1.2, audio: ["G", 4, 2], color: "255, 193, 7" },
  { id: 13, speed: 1.3, audio: ["A", 4, 2], color: "255, 152, 0" },
  { id: 14, speed: 1.4, audio: ["B", 4, 2], color: "255, 87, 34" },
  { id: 15, speed: 1.5, audio: ["C", 5, 2], color: "153, 0, 0" },
  { id: 16, speed: 1.6, audio: ["D", 5, 2], color: "66, 0, 0" },
];

const piano = Synth.createInstrument("piano");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const r = 180;
let isPlay = false;

ctx.beginPath();
ctx.moveTo(r, r);
ctx.lineTo(r, 2 * r);
ctx.lineWidth = 3;
ctx.stroke();

function drawCircleAndLine({ id, speed, audio, color }) {
  let angle = 0;
  let opacity = 1;

  return function () {
    ctx.save();
    ctx.beginPath();
    ctx.translate(r, r);
    ctx.rotate((Math.PI / 180) * angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, r - id * 10);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(
      r - (r + 5 - id * 10) * Math.sin((Math.PI / 180) * angle),
      r + (r + 5 - id * 10) * Math.cos((Math.PI / 180) * angle),
      5,
      0,
      2 * Math.PI
    );
    ctx.lineWidth = 1;
    ctx.fillStyle = `rgba(${color},${opacity})`;
    ctx.fill();
    ctx.stroke();

    angle = Math.round((angle + speed * 3) * 10) / 10;

    if (opacity < 1) opacity += 0.01;
    if (angle >= 360) {
      angle = 720 - angle;
      speed *= -1;
      piano.play(...audio);
      opacity = 0.3;
    }
    if (angle <= 0) {
      angle = Math.abs(angle);
      speed *= -1;
      piano.play(...audio);
      opacity = 0.3;
    }
  };
}

function runFunc() {
  return circleDetails.map((obj) => drawCircleAndLine(obj));
}

let funcList = runFunc();
funcList.forEach((f) => f());

circleDetails.forEach((circle) => {
  drawCircleAndLine(circle);
});

function play(el) {
  isPlay = !isPlay;

  if (el.innerText === "Play") {
    animate();
    el.innerText = "Stop";
  } else {
    el.innerText = "Play";
  }
}

function animate() {
  resetCanvas();
  funcList.forEach((f) => f());

  if (isPlay) {
    requestAnimationFrame(animate);
  }
}

function reset(el) {
  isPlay = false;
  setTimeout(() => {
    resetCanvas();
    funcList = runFunc();
    funcList.forEach((f) => f());
  }, 20);

  el.previousElementSibling.innerText = "Play";
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(r, r);
  ctx.lineTo(r, 2 * r);
  ctx.lineWidth = 3;
  ctx.stroke();
}
