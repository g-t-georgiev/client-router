import Component from "../../components/Component.js";
import eventTransmitter from "../../components/EventTransmitter.js";

export class NavListBtn extends Component {

    connectedCallback() {

        super.connectedCallback();
        // console.log('NavListBtn#connectedCallback');

        let url = new URL(this.root.href);
        let title = this.root.getAttribute('title');

        this.clickHandler = (ev) => {
            ev.preventDefault();
            let urlData = url.pathname;
            if (url.hash) urlData += url.hash;
            eventTransmitter.dispatch('router:navigate', urlData);
        };

        this.root.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {

        super.disconnectedCallback();
        // console.log('NavListBtn#disconnectCallback');
        this.root.removeEventListener('click', this.clickHandler);
    }
}

export default NavListBtn;