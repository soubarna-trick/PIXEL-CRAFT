const image9 = document.getElementById('image9');
const chooseImgButton9 = document.querySelector('.choose-img9');
const fileInput9 = document.querySelector('.file-input9');
const aspectRatioButtons9 = document.querySelectorAll('.options9 .button9');
const manualCropButton9 = document.getElementById('manual-crop9');
const resetFilterButton9 = document.querySelector('.reset-filter9');
const saveImgButton9 = document.querySelector('.save-img9');
const previewImg9 = document.querySelector('.preview-img9');
const chooseImageSection9 = document.getElementById('choose-image-section9');

let cropper;

// Hide reset and save buttons initially
resetFilterButton9.classList.add('hidden9');
saveImgButton9.classList.add('hidden9');

chooseImgButton9.addEventListener('click', () => fileInput9.click());

fileInput9.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image9.onload = () => {
                image9.classList.remove('hidden9');
                chooseImageSection9.style.display = 'none';
                resetFilterButton9.classList.remove('hidden9');
                saveImgButton9.classList.remove('hidden9');
                previewImg9.style.backgroundImage = "none";

                if (cropper) {
                    cropper.destroy();
                }

                try {
                    cropper = new Cropper(image9, {
                        aspectRatio: NaN,
                        viewMode: 1,
                        responsive: true,
                        zoomable: false,
                        movable: false,
                        autoCropArea: 1,
                        ready() {
                            this.cropper.crop();
                        },
                        cropmove(event) {
                          if (event.detail.action === 'move') {
                            cropper.setDragMode('move');
                          }
                        }
                    });
                } catch (error) {
                    console.error("Cropper initialization error:", error);
                    alert("Error initializing cropper. Please try a different image or check the console for details.");
                }
            };
            image9.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

aspectRatioButtons9.forEach(button9 => {
    button9.addEventListener('click', () => {
        aspectRatioButtons9.forEach(btn9 => btn9.classList.remove('active9'));
        manualCropButton9.classList.remove("active9");
        button9.classList.add('active9');

        const aspectRatioString = button9.dataset.aspectRatio;
        let aspectRatio;

        if (aspectRatioString.includes('/')) {
            const ratioParts = aspectRatioString.split('/');
            aspectRatio = parseInt(ratioParts[0]) / parseInt(ratioParts[1]);
        } else {
            aspectRatio = parseFloat(aspectRatioString);
        }

        if (cropper) {
            cropper.setAspectRatio(aspectRatio);
        }
    });
});

manualCropButton9.addEventListener('click', () => {
    aspectRatioButtons9.forEach(btn9 => btn9.classList.remove('active9'));
    manualCropButton9.classList.add("active9");
    if (cropper) {
      cropper.setAspectRatio(NaN);
    }
});

resetFilterButton9.addEventListener('click', () => {
    if (cropper) {
        cropper.destroy();
        cropper = new Cropper(image9, {
            aspectRatio: NaN,
            viewMode: 1,
            responsive: true,
            zoomable: false,
            movable: false,
            autoCropArea: 1,
            ready() {
                this.cropper.crop();
            }
        });
    }

    aspectRatioButtons9.forEach(btn9 => btn9.classList.remove('active9'));
    manualCropButton9.classList.remove("active9");
    previewImg9.style.backgroundImage = "none";
});

saveImgButton9.addEventListener('click', () => {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'cropped_image.png';
            link.click();
        }
    }
});