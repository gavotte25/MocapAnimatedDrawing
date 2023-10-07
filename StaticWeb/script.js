let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let fileName = document.getElementById("file-name");
let container = document.querySelector(".container");
let error = document.getElementById("error");
let display = document.getElementById("display");
let processBtn = document.getElementById("process-btn");
let motionSelect = document.getElementById("motion-select");
let newWindow;
let checkStatusInterval;

const CREATE_ANNOTATION_URL = "http://localhost:1025/create-annotation";
const GET_MOTION_LIST_URL = "http://localhost:1025/motions";
const PROCESS_IMG_URL = "http://localhost:1025/process-img"
const CHECK_EXISTS_ANNOTATION = "http://localhost:1025"

const fileHandler = (file, name, type) => {
  if (type.split("/")[0] !== "image") {
    //File Type Error
    error.innerText = "Please upload an image file";
    return false;
  }
  error.innerText = "";
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    //image and file name
    let imageContainer = document.createElement("figure");
    let img = document.createElement("img");
    img.src = reader.result;
    imageContainer.appendChild(img);
    imageContainer.innerHTML += `<figcaption>${name}</figcaption>
      <div class="row justify-content-center mt-2">
        <button id="annotate-btn" type="submit" onclick="submitPhoto()" class="btn btn-primary">Get annotations</button>
      </div>`;
      display.appendChild(imageContainer);
  };
};

//Upload Button
uploadButton.addEventListener("change", () => {
  display.innerHTML = "";
  processBtn.classList.add("d-none");
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
  loadMotionList();
  skipAnnoIfHas();
  startCheckStatus();
};

const loadMotionList = async () => {
  let response = await fetch(GET_MOTION_LIST_URL);
  let json = await response.json();
  var items = "<option value='unset' selected>Select motion...</option>"
  for (let motion of json.motions) {
    items += `<option value=${motion}>${motion}</option>`
  }
  motionSelect.innerHTML = items;
}

const submitPhoto = async () => {
  let annotateBtn = document.getElementById("annotate-btn");
  annotateBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Loading...`;
  annotateBtn.classList.add("disabled");
  let photo = uploadButton.files[0];
  let formData = new FormData();
  formData.append("file", photo);
  let response = await fetch(CREATE_ANNOTATION_URL, {
    method: "POST", 
    body: formData
  });
  if (response.status >= 400) {
    errorText = await response.text();
    annotateBtn.innerHTML = "Get annotations"
    annotateBtn.classList.remove("disabled");
    alert(errorText);
    return;
  } else {
    display.innerHTML = `<iframe id="fix-anno" src="http://127.0.0.1:5050/" frameborder="0"></iframe>`;
    processBtn.classList.remove("d-none");
  }
};

const processPhoto = async () => {
  if (motionSelect.value == 'unset') {
    alert("A motion must been chosen before processing.");
    return;
  }
  processBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;
  processBtn.classList.add("disabled");
  let formData = new FormData();
  formData.append("motion", motionSelect.value);
  let response = await fetch(PROCESS_IMG_URL, {
    method: "POST",
    body: formData
  })
  processBtn.innerHTML = "Process"
  processBtn.classList.remove("disabled");
  if (response.status >= 400) {
    alert(await response.text())
  } else {
    showResult();
  }
}

const showResult = () => {
  let tmp = new Image();
  let gifPath = "../SharedVolume/Annotation/video.gif";
  tmp.onload = function() {
    if (newWindow) {
      newWindow.close();
    }
    newWindow = window.open("", "", `width=${this.width + 20},height=${this.height + 20}`);
    newWindow.document.write(`<img src='${gifPath}'>`);
  }
  tmp.src = gifPath;
}

const skipAnnoIfHas = async () => {
  let response = await fetch(CHECK_EXISTS_ANNOTATION);
  let json = await response.json();
  if (json.exists) {
    display.innerHTML = `<iframe id="fix-anno" src="http://127.0.0.1:5050/" frameborder="0"></iframe>`;
    processBtn.classList.remove("d-none");
  }
}

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
  checkStatusInterval = setInterval(function() { checkServerStatus()}, 60000);
}

const stopCheckStatus = () => {
  if (checkStatusInterval) {
    clearInterval(checkStatusInterval);
  }
  checkStatusInterval = null;
}