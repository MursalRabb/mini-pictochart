const getImages = () => {
  const baseUrl = "http://localhost:8000"
  const list = document.getElementById("img-ul")


  // Selecting image from the list
  const selectImage = (event) => {
    console.log(event.target.src)
    const img = document.createElement("img")
    img.src = event.target.src
    img.id = "image"
    const canvas = document.getElementById("canvas")
    canvas?.replaceChild(img, canvas.childNodes[0])
  }


  // Loading images from the server
  fetch(`${ baseUrl }/images`).then(res => {
    res.json().then(arr => {
      for (let index = 0; index < arr.length; index++) {
        const img = document.createElement("img")
        img.onclick = selectImage
        img.src = arr[index];
        list?.appendChild(img)
      }
    })
  })

  // Uploading image to server
  const form = document.getElementById("upload-form")
  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    console.log(Object.fromEntries(data))

    fetch(`${ baseUrl }/uploads`, {
      method: "POST",
      body: data
    }).then((res) => {
      res.json().then(data => {
        const img = document.createElement("img")
        img.onclick = selectImage
        img.src = data.file
        list?.appendChild(img)
        list?.appendChild
      })
    })
  })
  
  // Text adding
  const handleAddText = () => {
    const canvas = document.getElementById("canvas")
    const h1 = document.createElement("h1")
    h1.innerHTML = document.getElementById("addTextInput").value
    dragElement(h1)
    canvas?.replaceChild(h1, canvas.childNodes[1])
  }

  const addTextButton = document.getElementById("addText")
  addTextButton?.addEventListener("click", handleAddText)

  // Dragging logic
  function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


// Funtion to convert dataurl to file
function dataURLtoFile(dataurl, filename) {
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

// Save image
document.getElementById("saveChanges")?.addEventListener("click", async (e) => {
  e.preventDefault()

  const canvasDiv = await html2canvas(document.getElementById("canvas"))
  const canvasURL = canvasDiv.toDataURL("neImage.png")
  
  var file = dataURLtoFile(canvasURL, 'image.png');
  console.log(file)
  let data = new FormData()
  data.append("upload", file)

  await fetch(`${ baseUrl }/uploads`, {
      method: "POST",
      // headers: { "Content-Type": "mutlipart/form-data" },
      body: data
    }).then(data => {
      const img = document.createElement("img")
        img.onclick = selectImage
        img.src = data.file
        list?.appendChild(img)
        list?.appendChild
    })
})

}

window.onload = getImages