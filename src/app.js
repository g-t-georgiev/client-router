import { Router } from './lib/router/index.js';
import { eventTransmitter } from './lib/events/index.js';
import { NavList, NavListBtn } from "./components/index.js";

const root = document.getElementById('root');
const navList = new NavList(document.querySelector('nav'));
const navListBtns = Array.from(navList.querySelectorAll('a'), (el) => new NavListBtn(el));

const router = new Router();

router.addRoute({
    path: '*', middlewares: [
        async (ctx) => {

            console.log(`* - ${ctx.url} - middleware1`, ctx);
        }
    ]
});

router.addRoute({
    path: '/user/*', middlewares: [
        async (ctx) => {

            console.log(`/user/* - ${ctx.url} - middleware1`, ctx);
        }
    ]
});

router.addRoute({
    path: '/user/:id/profile/:operation',
    title: 'Profile actions',
    middlewares: [
        (ctx) => {

            console.log(`${ctx.url} - middleware1`, ctx);
        },
        (ctx) => {

            console.log(`${ctx.url} - middleware2`, ctx);
            let operation = ctx.params['operation'];
            root.innerHTML = `<div>Profile ${operation[0].toUpperCase()}${operation.slice(1)}</div>`.trim();
        }
    ]
});

router.addRoute({
    path: '/user/:id/profile',
    title: 'Profile',
    middlewares: [
        async (ctx) => await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {

                        let resp = await fetch('./data.json');
                        let data = await resp.json();
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                }, 3000);
            })
            .catch((err) => {
                console.error(err);
            })
            .then((data) => {
                ctx.data = data;
                console.log(`${ctx.url} - middleware1`, ctx);
            }),

        (ctx) => {

            console.log(`${ctx.url} - middleware2`, ctx);
        },

        (ctx) => {

            console.log(`${ctx.url} - middleware3`, ctx);
            root.innerHTML = `<div>Profile</div>`.trim();
        }
    ]
});

router.addRoute({
    path: '/user/:id',
    title: 'Dashboard',
    middlewares: [
        (ctx) => {

            console.log(`${ctx.url} - middleware1`, ctx);
        },
        (ctx) => {

            console.log(`${ctx.url} - middleware2`, ctx);
            root.innerHTML = `<div>Profile Dashboard</div>`.trim();
        }
    ]
});

router.addRoute({
    path: '/about',
    title: 'About',
    middlewares: [
        (ctx) => {

            console.log(`${ctx.url} - middleware1`, ctx);
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

            console.log(`${ctx.url} - middleware1`, ctx);
        },
        (ctx) => {

            console.log(`${ctx.url} - middleware2`, ctx);
            root.innerHTML = `
            <div>Home</div>`.trim();
        }
    ]
});

router.addRoute('*', '404! Page not found', (ctx) => {

    console.log(`${ctx.url} - middleware1`, ctx);
    root.innerHTML = `
    <div><span style="font-weight: 600;">404!</span> Page not found</div>`.trim();
});

// console.log('ROUTES', router.routes);

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