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
        <div class="camera">
            <video id="video">Video stream not available.</video>
            <button id="startbutton">Take photo</button>
            <button id="sendbutton">Send photo</button>
        </div>
        <canvas id="canvas"></canvas>
        `;

        this.startup();
    }

    startup() {
        let streaming = false;
        const width = 640; // We will scale the photo width to this
        let height = 0; // This will be computed based on the input stream

        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let startbutton = document.getElementById("startbutton");
        let sendbutton = document.getElementById("sendbutton");

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
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            },
            false
        );

        startbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.takepicture(canvas, video, width, height);
            },
            false
        );

        sendbutton.addEventListener(
            "click",
            (ev) => {
                ev.preventDefault();
                this.sendpicture();
            },
            false
        );

        this.clearphoto(canvas);
    }

    takepicture(canvas, video, width, height) {
        const context = canvas.getContext("2d");

        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            this.photoData = canvas.toDataURL("image/png");
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

        console.log(cdnUrl);

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
            });
        }
    }
}
