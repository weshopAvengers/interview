
// ！！这道题在多个面经中刷到
// 无序数组中找出 N 个数，其和为 M 的所有可能；
// 如：[1，3，2，4，8,6,7,5]找出3个数和为9的所有可能
// 输出 [[1,2,6], [1,3,5], [2,3,4]]
function search(arr, num, sum) {
    let length = arr.length 

    // 根据当前数组长度，算出总共多少种可能
    let bit = 1 << length; 

    // 算出num个数的所有组合
    let arr1 = []
    for (let i=1; i< bit; i++) {
        let toBit = i.toString(2)
        // 在前面补上0，确保位数是原arr的length
        toBit = Array.from(Array(length - toBit.length), item => 0).join('') + toBit
        // 筛选出所有1的个数为num的组合
        if (toBit.split('').filter(item => item === '1').length === num) {
            arr1.push(toBit)
        }
    }

    // 将arr1还原为原传入数组arr，即 把value加上
    let arr2 = []
    arr2 = arr1.map((item, i) => {
        return item.split('').map((jtem, j) => {
            return {
                value: arr[j],
                status: +jtem
            }
        }).filter(item => item.status)
    })

    // 找到所有加起来为m的可能
    return arr2.filter(item => {
        let sum1 = item.reduce((total, jtem, i) => {
            return total + jtem.value
        }, 0)
        return sum1 === sum
    }).map(item => item.map(jtem => jtem.value))
}
console.log(search([1,3,2,4,8,6,7,5], 4, 12))