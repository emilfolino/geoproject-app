import { tenorKey } from "../utils.js";

export default class GifComponent extends HTMLElement {
    constructor() {
        super();

    }

    async connectedCallback() {
        const URL = `https://tenor.googleapis.com/v2/search?key=${tenorKey}&q=monday&limit=10`;
        const response = await fetch(URL);
        const result = await response.json();

        console.log(result);
    }
}
