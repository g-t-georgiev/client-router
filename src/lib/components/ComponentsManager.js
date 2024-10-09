class ComponentsManager {

    #observer;
    #observedElements;

    constructor() {
        this.#observedElements = new WeakMap();

        this.#observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.removedNodes.forEach(this.#onNodeRemove, this);
                mutation.addedNodes.forEach(this.#onNodeAppend, this);
            });
        });

        this.#observer.observe(document, { childList: true, subtree: true });
    }

    register(component) {
        if (this.#observedElements.has(component.root)) return;

        this.#observedElements.set(component.root, {
            connectedCallback: component.connectedCallback.bind(component),
            disconnectedCallback: component.disconnectedCallback.bind(component)
        });

        if (document.contains(component.root)) {
            this.#observedElements.get(component.root).connectedCallback();
        }
    }

    unregister(component) {
        if (!this.#observedElements.has(component.root)) return;

        this.#observedElements.delete(component.root);
    }

    #onNodeAppend(node) {
        if (!this.#observedElements.has(node)) return;

        this.#observedElements.get(node).connectedCallback();
    }

    #onNodeRemove(node) {
        if (!this.#observedElements.has(node)) return;

        this.#observedElements.get(node).disconnectedCallback();
    }
}


export const componentsManager = new ComponentsManager();
export default componentsManager;