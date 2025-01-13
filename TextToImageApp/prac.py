import streamlit as st
from huggingface_hub import InferenceClient
from PIL import Image
import io
import base64
import tempfile
import os


HF_TOKEN = "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"  # Replace with your actual token

# Replace with your actual Hugging Face token (use environment variables in production!)
HF_TOKEN = os.environ.get("HF_TOKEN")


try:
    client = InferenceClient("anthienlong/flux_image_enhancer", token=HF_TOKEN)
except Exception as e:
    st.error(f"Error initializing InferenceClient: {e}")
    st.stop()

st.markdown(
    """
    <style>
        body {
            background-color: #121212 !important;
            color: #eee;
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
        .image-container {
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-top: 20px;
            padding: 10px;
            text-align: center;
        }
        .image-container img {
            max-width: 100%;
            height: auto;
        }
        .download-button {
            margin-top: 10px;
            text-align: center;
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

st.title("Image Enhancement with Hugging Face")

prompt = st.text_input("Enter a prompt (optional, for conditional enhancement):", "")

if st.button("Enhance Image"):
    if not prompt.strip():
        st.warning("No prompt provided. Performing general image enhancement.")

    with st.spinner("Enhancing image..."):
        try:
            image = client.text_to_image(prompt)

            if image:
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
                    image.save(tmp_file, format="PNG")
                    tmp_filename = tmp_file.name

                with open(tmp_filename, "rb") as f:
                    image_data = f.read()
                os.remove(tmp_filename)

                img_str = base64.b64encode(image_data).decode()

                st.markdown(f'<div class="image-container"><img src="data:image/png;base64,{img_str}" alt="Enhanced Image"></div>', unsafe_allow_html=True)
                st.markdown(f'<div class="download-button"><a href="data:image/png;base64,{img_str}" download="enhanced_image.png">Download Image</a></div>', unsafe_allow_html=True)

            else:
                st.error("Image generation failed. Please check your prompt or try again later.")

        except Exception as e:
            st.error(f"An error occurred during image enhancement: {e}")
            st.error("Please ensure you have a valid Hugging Face token and that the API is accessible.")