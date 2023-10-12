let uploadButton = document.getElementById("upload-button");
let container = document.querySelector(".container");
let error = document.getElementById("error");
let display = document.getElementById("display");
let submitBtn = document.getElementById("submit-btn");
let motionNameInput = document.getElementById("name-input");
let checkStatusInterval;

const CURRENT_URL = window.location.href;
let host = "localhost";
if (CURRENT_URL.startsWith("http")) {
  let startIndex = CURRENT_URL.indexOf("://") + 3;
  let endIndex = CURRENT_URL.indexOf("/",8);
  if (startIndex >= 0 && endIndex > startIndex) {
    host = CURRENT_URL.substring(startIndex, endIndex);
  } 
}

const EXTRACT_MOTION_URL = `http://${host}:1025/extract-motion`;
const GET_STATUS_URL = `http://${host}:1025/status`;

const fileHandler = (file, name, type) => {
  if (type.split("/")[0] !== "video") {
    //File Type Error
    error.innerText = "Please upload an video file";
    return false;
  }
  error.innerText = "";
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    let blobURL = URL.createObjectURL(file);
    let videoContainer = document.createElement("video");
    videoContainer.setAttribute("controls","");
    videoContainer.setAttribute("style","width:320px");
    videoContainer.classList.add("mt-3");
    videoContainer.innerHTML += `
      <source src="${blobURL}" type="video/mp4">
      Your browser does not support the video tag.`;
    display.appendChild(videoContainer);
    submitBtn.classList.remove("d-none");
    motionNameInput.classList.remove("d-none");
  };
};

//Upload Button
uploadButton.addEventListener("change", () => {
  display.innerHTML = "";
  submitBtn.classList.add("d-none");
  motionNameInput.classList.add("d-none");
  Array.from(uploadButton.files).forEach((file) => {
    fileHandler(file, file.name, file.type);
  });
});

container.addEventListener(
  "dragenter",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add("active");
  },
  false
);

container.addEventListener(
  "dragleave",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("active");
  },
  false
);

container.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add("active");
  },
  false
);

container.addEventListener(
  "drop",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove("active");
    let draggedData = e.dataTransfer;
    let files = draggedData.files;
    display.innerHTML = "";
    Array.from(files).forEach((file) => {
      fileHandler(file, file.name, file.type);
    });
  },
  false
);

window.onload = () => {
  error.innerText = "";
  startCheckStatus();
};

const submitVideo = () => {
  submitBtn.classList.add("disabled");
  let formData = new FormData();
  let video = uploadButton.files[0];
  let name = motionNameInput.value;
  formData.append("file", video);
  formData.append("name", name)
  fetch(EXTRACT_MOTION_URL, {
    method: "POST", 
    body: formData
  });
  alert("Server is extracting motion in background. User will be informed once it's done.");
  submitBtn.classList.remove("disabled");
  window.location.replace("index.html");
};

const checkServerStatus = async () => {
  let response = await fetch(GET_STATUS_URL);
  let json = await response.json();
  switch(json.status) {
    case "EXTRACT_FAIL":
      alert("Extract motion failed!");
      break;
    case "EXTRACT_SUCCESS":
      alert("Extract motion success!");
      break;
    case "IDLE":
      stopCheckStatus();
      break;
  }
}

const startCheckStatus = () => {
  stopCheckStatus();
  checkServerStatus();
  checkStatusInterval = setInterval(function() { checkServerStatus()}, 30000);
}

const stopCheckStatus = () => {
  if (checkStatusInterval) {
    clearInterval(checkStatusInterval);
  }
  checkStatusInterval = null;
}