// 节流， 

function throttle(fn ,delay) {
    let beginDate = Date.now();
    let timer = null;

    return function(...args) {
        let nextDate = Date.now();
        let context = this
        if (nextDate - beginDate >= delay) {
            if (timer) clearTimeout(timer)
            fn.apply(context, args)
            beginDate = Date.now()
        } else {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(context, args)
                    beginDate = Date.now()
                }, delay - (nextDate - beginDate))
            }
        }
    }
}

// 防抖
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        const context = this
        if (timer) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, delay) 
        } else {
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, delay) 
        }
    }
}