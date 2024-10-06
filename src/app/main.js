import Router from '../router/Router.js';
import eventTransmitter from '../components/EventTransmitter.js';
import { NavList, NavListBtn } from "./nav/index.js";

const root = document.getElementById('root');
const navList = new NavList(document.querySelector('nav'));
const navListBtns = Array.from(navList.querySelectorAll('a'), (el) => new NavListBtn(el));

const router = new Router();

router.addRoute({ path: '*', middlewares: [
    async (ctx) => {
        console.log(ctx.route, ctx.params);
    }
]});

router.addRoute({ path: '/user/*', middlewares: [
    async (ctx) => {
        console.log(ctx.route, ctx.params);
    }
]});

router.addRoute({ 
    path: '/user/:id/profile/:operation',
    title: 'Profile actions', 
    middlewares: [
        (ctx) => {
            const { params, state, route } = ctx;
            console.log(route, params)
        },
        (ctx) => {
            let operation = ctx.params['operation'];
            root.innerHTML = `<div>Profile ${operation[0].toUpperCase()}${operation.slice(1)}</div>`.trim();
        }
    ]
});

router.addRoute({ 
    path: '/user/:id/profile',
    title: 'Profile', 
    middlewares: [
        (ctx) => {
            const { params, state, route } = ctx;
            console.log(route, params);
        },
        (ctx) => {
            root.innerHTML = `<div>Profile</div>`.trim();
        }
    ]
});

router.addRoute({ 
    path: '/user/:id',
    title: 'Dashboard', 
    middlewares: [
        (ctx) => {
            const { params, state, route } = ctx;
            console.log(route, params);
        },
        (ctx) => {
            root.innerHTML = `<div>Profile Dashboard</div>`.trim();
        }
    ]
});

router.addRoute({ 
    path: '/about',
    title: 'About', 
    middlewares: [
        (ctx) => {
            console.log(ctx.route, ctx.state, ctx.params);
        },
        (ctx) => {
            root.innerHTML = `
            <div style="margin-bottom: 2000px;" data-top>About page</div>
            <div style="font-weight: 700; margin-bottom: 70px;" id="test">#test</div>`.trim();
        }
    ]
});

router.addRoute({ 
    path: '/',
    title: 'Home', 
    middlewares: [
        async (ctx) => {
            console.log(ctx.route, ctx.params);
        },
        (ctx) => {
            root.innerHTML = `
            <div>Home</div>`.trim();
        }
    ]
});

router.addRoute('*', '404! Page not found', (ctx) => {
    root.innerHTML = `
    <div><span style="font-weight: 600;">404!</span> Page not found</div>`.trim();
});

console.log('ROUTES', router.routes);

eventTransmitter.subscribe('router:navigate', (ev) => {
    let url;
    if (typeof ev.detail === 'string') {
        url = ev.detail;
    }

    router.navigateTo(url);
});

window.addEventListener('load', () => {
    eventTransmitter.dispatch('router:navigate', location.pathname);
});

window.addEventListener('popstate', () => {
    eventTransmitter.dispatch('router:navigate', location.pathname);
});