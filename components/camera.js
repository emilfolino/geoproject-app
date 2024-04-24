import { UploadClient } from "https://cdn.jsdelivr.net/npm/@uploadcare/upload-client@6.14.1/dist/esm/index.browser.mjs";

import { uploadKey } from "../utils.js";

export default class CameraComponent extends HTMLElement {
    constructor() {
        super();

        this.photoData = "";
        this.projectid = "";
    }

    static get observedAttributes() {
        return ['projectid'];
    }

    // attribute change
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[property] = newValue;
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="camera" id="camera">
            <video id="video">Video stream not available.</video>
            <button class="startbutton" id="startbutton">&nbsp;</button>
        </div>
        `;

        this.startup();
    }

    startup() {
        let streaming = false;
        const width = window.screen.width; // We will scale the photo width to this
        let height = 0; // This will be computed based on the input stream

        let video = document.getElementById("video");
        let camera = document.getElementById("camera");
        let startbutton = document.getElementById("startbutton");

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener(
            "canplay",
            () => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute("width", width);
                    video.setAttribute("height", height);
                    streaming = true;
                }
            },
            false
        );

        startbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.takepicture(video, width, height, camera);
            },
            false
        );
    }

    takepicture(video, width, height, camera) {
        let canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (width && height) {
            video.remove();
            camera.prepend(canvas);

            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            this.photoData = canvas.toDataURL("image/png");

            this.sendpicture();
        } else {
            this.clearphoto(canvas);
        }
    }

    clearphoto(canvas) {
        const context = canvas.getContext("2d");

        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        this.photoData = canvas.toDataURL("image/png");
    }

    async sendpicture() {
        const blob = await (await fetch(this.photoData)).blob();

        const client = new UploadClient({ publicKey: uploadKey });

        const fileInfo = await client.uploadFile(blob);
        const cdnUrl = fileInfo.cdnUrl;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {

                const imageData = {
                    url: cdnUrl,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    project_id: parseInt(this.projectid),
                };

                const response = await fetch("http://localhost:8866/images", {
                    body: JSON.stringify(imageData),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST'
                });

                const result = await response.json();

                document.dispatchEvent(new CustomEvent(
                    'photoAdded',
                    { detail: { photo: imageData } }
                ));

                this.remove();
            });
        }
    }
}
