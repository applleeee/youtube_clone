<<<<<<< HEAD
const videoUrl = document.querySelector("#videoUrl");
const thumbUrl = document.querySelector("#thumbUrl");

const video = document.querySelector("#video");
const thumb = document.querySelector("#thumb");

video.addEventListener("input", () => {
  const url = video.files[0].name;
  videoUrl.value = String(url);
});

thumb.addEventListener("input", () => {
  const url = thumb.files[0].name;
  thumbUrl.value = String(url);
});
=======
const videoUrl = document.querySelector("#videoUrl");
const thumbUrl = document.querySelector("#thumbUrl");

const video = document.querySelector("#video");
const thumb = document.querySelector("#thumb");

video.addEventListener("input", () => {
  const url = video.files[0].name;
  videoUrl.value = String(url);
});

thumb.addEventListener("input", () => {
  const url = thumb.files[0].name;
  thumbUrl.value = String(url);
});
>>>>>>> 3d56e735527d06c899ce66371cd52eb613986432
