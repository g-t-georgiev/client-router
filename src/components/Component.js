import componentsManager from "./ComponentsManager.js";

export class Component {

    /**
     * @constructor
     * @param {HTMLElement} root 
     * @returns {HTMLElement}
     */
    constructor(root) {
        this.subscriptions = new Set();
        this.root = root;
        componentsManager.register(this);

        return root;
    }

    connectedCallback() { }

    disconnectedCallback() {

        this.subscriptions.forEach(sub => sub?.());
        this.subscriptions.clear();
    }
}

export default Component;