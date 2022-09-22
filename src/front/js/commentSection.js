const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const a = document.querySelectorAll(".video__comment__delete");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const a = document.createElement("a");
  a.innerText = "X";
  a.style = "color:red";
  newComment.appendChild(span); //맨앞에 추가
  newComment.appendChild(a);
  videoComments.prepend(newComment); //맨뒤에 추가
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 서버에게 내용이 json이라는 것을 알림
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleDelete = async (event) => {
  const videoId = videoContainer.dataset.id;
  const comment = event.path[1];
  const commentId = event.path[1].dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comment-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // 서버에게 내용이 json이라는 것을 알림
    },
    body: JSON.stringify({ commentId }),
  });
  if (response.status === 200) {
    comment.remove();
    return;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

a.forEach((button) => {
  button.addEventListener("click", handleDelete);
});
