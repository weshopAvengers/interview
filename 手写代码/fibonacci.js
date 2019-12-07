// 最基础 尾递归
function fibonacci(n) {
    if (n == 1 || n == 2) {
        return 1
    };
    return fibonacci(n - 2) + fibonacci(n - 1);
}
fibonacci(30)

// 改进版尾递归，避免重复计算
function fibonacci(n) {
    function fib(n, v1, v2) {
        if (n == 1)
            return v1;
        if (n == 2)
            return v2;
        else
            return fib(n - 1, v2, v1 + v2)
    }
    return fib(n, 1, 1)
}
fibonacci(30)

// for循环
function fibonacci(n) {
    var n1 = 1, n2 = 1, sum;
    for (let i = 2; i < n; i++) {
        sum = n1 + n2
        n1 = n2
        n2 = sum
    }
    return sum
}
fibonacci(30)