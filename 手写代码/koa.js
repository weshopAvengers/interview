import { Http2Server } from "http2"

class Koa {
    constructor() {
        this.middleware = []
    }
    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args)
    }
    callback() {
        const fn = this.compose()
        return fn(context, next)
    }
    compose() {
        return function(ctx, next) {
            dispatch(0)
            function dispatch(i) {
                if (i === this.middleware.length) fn = next
                let fn = this.middleware[i]
                if (!fn) return
                return fn(ctx, dispatch(i++))
            }
        }
    }
    use(fn) {
        this.middleware.push(fn)
    }
}