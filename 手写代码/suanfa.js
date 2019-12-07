// 基础算法

// 1.冒泡
function maopao(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                let temp = arr[j+1]
                arr[j] = temp
                arr[j+1] = arr[j]
            }
        }
    }
    return arr
}

// 快排
function quick(arr) {
    if (arr.length <= 1) {
        return arr;
      }
    let index = Math.floor(arr.length / 2)
    let item = arr.splice(index, 1)[0];

    let leftArr = [], rightArr = [];
    for (let i =0;i< arr.length; i++) {
        if (arr[i] < item) {
            leftArr.push(arr[i])
        } else {
            rightArr.push(arr[i])
        }
    }
    return quick(leftArr).concat(item, quick(rightArr))
}
var a = quick([1,2,3,5,4])
console.log('a', a)

// ...