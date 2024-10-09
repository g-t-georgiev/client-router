export class Router {

    /**
     * @constructor
     * 
     * @param {Array<{ path: string, title: string, middlewares: ((params: any) => void)[]}>} routes 
     */
    constructor(routes = []) {
        this.routes = routes;
    }

    /**
     * 
     * @param {string} path 
     * @param {string} title 
     * @param  {...(params: any) => void} middlewares 
     * @retruns 
     */
    addRoute(path, title, ...middlewares) {
        if (typeof arguments[0] === 'object') {
            let obj = arguments[0];
            if (!obj.path) obj.path = '/';
            if (!obj.title) obj.title = '';
            if (!obj.middlewares) obj.middlewares = [];
            this.routes.push(obj);
        } else {
            this.routes.push({ path, title, middlewares });
        }
    }

    /**
     * 
     * @param {string} path 
     * @returns 
     */
    removeRoute(path) {
        let index = this.routes.findIndex(route => route == path, this);

        if (index !== -1) this.routes.splice(index, 1);
    }

    /**
     * 
     * @param {string} path 
     * @param {string} url 
     * @returns {{ [key: string]: any } | {}}
     */
    extractParams(path, url) {
        const paramKeys = [];
        const regexPath = path.replace(/:([^\/]+)/g, (_, key) => {
            paramKeys.push(key);
            return '([^\\/]+)';
        });

        const match = url.match(new RegExp(`^${regexPath}$`));
        const params = {};

        if (match) {
            // console.log('Router#extractParams', match);
            paramKeys.forEach((key, index) => {
                params[key] = match[index + 1];
            });
        }

        return params;
    }

    /**
     * 
     * @param {string} url 
     * @param {({ state: {}, params: {}, route: string }) => void} finalizer 
     * @returns 
     */
    matchRoute(url, finalizer) {
        let matched = false;
        let context = { params: {}, state: {}, route: '' };
        let middlewares = [];

        let i = 0,
            n = this.routes.length;

        for (; i < n; i++) {

            const route = this.routes[i];

            if (route.path.includes('*')) {

                const genericPath = route.path.replace(/(\/)?\*/, '(\\/)?.*');
                const genericRegex = new RegExp(`^${genericPath}`);

                if (genericRegex.test(url)) {

                    if (route.middlewares && route.middlewares?.length) {
                        middlewares.push(...route.middlewares);
                    }

                    if (i == n - 1 && !matched) {

                        context.url = '/404-page-not-found';
                        context.route = route.path;
                        context.state = history.state;
                        context.params = {};

                        // execute middlewares
                        this.processTasksQueue(context, middlewares).then(finalizer);
                    }

                    continue;
                }
            }

            const regexPath = route.path.replace(/:([^\/]+)/g, '([^\\/]+)');
            const regex = new RegExp(`^${regexPath}$`);
            // console.log(`Router#matchRoute - Testing - URL: ${url} with REGEX: ${regex}`);

            if (regex.test(url)) {

                context.url = url;
                context.route = route.path;
                context.state = history.state ?? {};
                context.params = this.extractParams(route.path, url);
                if (route.middlewares && route.middlewares?.length) middlewares.push(...route.middlewares);

                // execute middlewares
                this.processTasksQueue(context, middlewares).then(finalizer);

                matched = true;
            }

            if (matched) return;
        }
    }

    processTasksQueue(ctx, queue) {
        console.log('TASKS QUEUE', queue.length);
        return new Promise((resolve) => {
            const handler = (ctx, queue) => {
                let currentTask = queue?.[0];
                if (typeof currentTask === 'function') {
                    queueMicrotask(async () => {
                        let result = currentTask?.(ctx);
                        if (result instanceof Promise) {
                            await result;
                        } else {
                            await Promise.resolve(result);
                        }
        
                        handler(ctx, queue.slice(1));
                    });
                    return;
                }

                resolve(ctx);
            };

            handler(ctx, queue);
        });
    }

    /**
     * 
     * @param {string} hash 
     * @returns 
     */
    scrollTo(hash) {
        let element = document.querySelector(`#${hash}`);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 
     * @param {string} url 
     * @returns 
     */
    navigateTo(url) {
        // console.log('Router#navigatTo', url);
        let [path, hash] = url.split('#');
        this.matchRoute(path, (ctx) => {

            history.pushState(ctx.state, '', ctx.url);

            if (hash) {
                // location.hash = hash;
                this.scrollTo(hash);
            }
        });

    }
}

export default Router;
