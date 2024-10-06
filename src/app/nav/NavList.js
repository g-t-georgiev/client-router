import Component from "../../components/Component.js";
import eventTransmitter from "../../components/EventTransmitter.js";

export class NavList extends Component {

    connectedCallback() {

        super.connectedCallback();
        // console.log('NavList#connectedCallback');

        this.btns = Array.from(this.root.querySelectorAll('[data-nav-btn]'));

        this.subscriptions.add(eventTransmitter.subscribe('router:navigate', (ev) => {
            let data;
            if (typeof ev.detail == 'object') {
                data = ev.detail.data;
            } else {
                data = ev.detail;
            }

            // console.log('NavListBtn#connectedCallback', ev.detail);
            let active = this.btns.find(btn => btn.classList.contains('current'));
            if (active) active.classList.remove('current');
            let current = this.btns.find(btn => btn.href.includes(data));
            if (current) current.classList.add('current');
        }));
    }

    disconnectedCallback() {

        super.disconnectedCallback();
        // console.log('NavList#disconnectCallback');
    }

}

export default NavList;