import os
import streamlit as st
from gradio_client import Client
from PIL import Image as PILImage
import io
import base64

# Set HF Token (REPLACE WITH YOUR ACTUAL TOKEN)
os.environ['HF_TOKEN'] = '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'  # Replace with your token
client = Client("black-forest-labs/FLUX.1-schnell")

st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Electrolize&display=swap');
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Electrolize", serif;
        }

        body {
            background-color: #121212 !important;
            color: #eee;
        }

        .heading {
            color: #FF69B4;
            text-align: center;
            margin-bottom: 20px;
        }

        .prompt-container {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .prompt-label {
            margin-right: 1rem;
            margin-top: 0.5rem;
            font-weight: bold;
            color: #eee;
            white-space: nowrap;
        }

        .stButton > button {
            background-image: linear-gradient(180deg, #C71585, #FF69B4);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
            transition: background-image 0.3s;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            height: 2.7rem;
        }

        .stButton>button:hover {
            color: black;
            background-image: linear-gradient(180deg, #FF69B4, #C71585);
        }

        .stButton > button:active {
            color: black;
        }

        #stDecoration {
            display: none;
        }

        .image-container {
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-top: 20px;
            padding: 10px;
            text-align: center; /* Center the image */
        }

        .image-container .stImage {
            border-radius: 0px;
            max-width: 100%; /* Make image responsive */
            height: auto;
        }
        .download-button {
            margin-top: 10px; /* Add some space above the button */
            text-align: center; /* Center the button */
        }
        .download-button a {
            background-color: #007bff;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }

        .download-button a:hover {
            background-color: #0056b3;
        }

    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown("<div class='prompt-container'>", unsafe_allow_html=True)
st.markdown("<div class='prompt-label'>Prompt:</div>", unsafe_allow_html=True)
prompt = st.text_area("", height=100, placeholder="A futuristic cityscape at sunset...")

if st.button("Generate Image"):
    if not prompt.strip():
        st.warning("Please enter a prompt.")
    else:
        with st.spinner("Generating image..."):

            try:
                result = client.predict(
                    prompt,
                    seed=0,
                    randomize_seed=True,
                    width=1024,
                    height=1024,
                    num_inference_steps=50,
                    api_name="/infer"
                )

                image_path = result[0]

                with open(image_path, "rb") as f:
                    image_data = f.read()

                image = PILImage.open(io.BytesIO(image_data))
                buffered = io.BytesIO()
                image.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode()

                preview_placeholder = st.empty()
                preview_placeholder.markdown(f'<div class="image-container"><img src="data:image/png;base64,{img_str}" alt="Generated Image"></div>', unsafe_allow_html=True)

                download_filename = "generated_image.png"
                download_link = f'<div class="download-button"><a href="data:image/png;base64,{img_str}" download="{download_filename}">Download Image</a></div>'
                st.markdown(download_link, unsafe_allow_html=True)

            except Exception as e:
                st.error(f"An error occurred: {e}")
                st.error("Please ensure you have a valid Hugging Face token and that the API is accessible.")