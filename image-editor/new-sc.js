const fileInput = document.querySelector(".file-input");
const adjustOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const filterrButtons = document.querySelectorAll(".filterr button");
const container = document.querySelector(".container");
const aspectRatioButtons = document.querySelectorAll('.options9 .button9:not(#manual-crop9)');

// Cropping elements (within editor-panel9)
// const aspectRatioButtons = document.querySelectorAll(".options9 .button9");
const manualCropButton = document.getElementById('manual-crop9');
const image = document.querySelector('.preview-img img');
// const fileInput = document.querySelector(".file-input");
let brightness = "100";
let saturation = "100";
let inversion = "0";
let grayscale = "0";
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

let cropper; // Cropper instance

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
      resetFilterBtn.click();
      container.classList.remove("disable");
      toggleOtherButtons(true); // ***THIS LINE IS CRUCIAL - Re-enable other buttons***
      toggleCropButtons(false);
  });
};
const applyFilter = () => {
  if (cropper) {
    cropper.setAspectRatio(cropper.options.aspectRatio)
    cropper.setStyle({
      transform: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`,
      filter: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`,
    });
  } else {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  }
};

adjustOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    document.querySelector(".slider").style.display = "block";
    document.querySelector(".filter-info").style.display = "block";

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

filterrButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filterValue = button.dataset.filter;
    if (cropper) {
      cropper.setStyle({ filter: filterValue });
    } else {
      previewImg.style.filter = filterValue;
    }
    document.querySelector(".slider").style.display = "none";
    document.querySelector(".filter-info").style.display = "none";
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  previewImg.style.filter = "none";
  applyFilter();
  adjustOptions[0].click();
  if (cropper) {
    cropper.destroy();
  }
};

const saveImage = () => {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'cropped_image.png';
            link.click();
        }
    } else {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = previewImg.naturalWidth;
        canvas.height = previewImg.naturalHeight;
        
        ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if(rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical);
        ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        
        const link = document.createElement("a");
        link.download = "image.jpg";
        link.href = canvas.toDataURL();
        link.click();
    }
};

const startCropping = (aspectRatio) => {
  if (cropper) {
    cropper.destroy();
    toggleAspectRatioButtons(true);
  }
  cropper = new Cropper(previewImg, {
    aspectRatio: aspectRatio,
    viewMode: 1,
    autoCropArea: 1,
    cropBoxMovable: true,
    cropBoxResizable: true,
    ready() {
        this.cropper.crop();
    },
    cropmove(event) {
        if (event.detail.action === 'move') {
            cropper.setDragMode('move');
        }
    }
  });
};

const toggleAspectRatioButtons = (enable) => {
  aspectRatioButtons.forEach(button => button.disabled = !enable);
};


aspectRatioButtons.forEach(button => {
  button.addEventListener('click', () => {
    aspectRatioButtons.forEach(btn => btn.classList.remove('active9'));
    manualCropButton.classList.remove("active9");
    button.classList.add('active9');
    toggleAspectRatioButtons(true); // Enable buttons after selection
    // const aspectRatioString = button.dataset.aspectRatio;
    const aspectRatioString = button.dataset.aspectRatio;
    button.disabled = true;
    let aspectRatio;

    if (aspectRatioString.includes('/')) {
      const ratioParts = aspectRatioString.split('/');
      aspectRatio = parseInt(ratioParts[0]) / parseInt(ratioParts[1]);
    } else {
      aspectRatio = parseFloat(aspectRatioString);
    }

    startCropping(aspectRatio);
  });
});

manualCropButton.addEventListener('click', () => {
  aspectRatioButtons.forEach(btn => btn.classList.remove('active9'));
  manualCropButton.classList.add("active9");
  startCropping(NaN); // Set NaN for manual cropping
});

// Event listeners - CRUCIAL ORDER
chooseImgBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);

































