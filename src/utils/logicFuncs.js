export default {
    and(arr, callback) {
        return arr.reduce((accum, item, index) => {
            return accum && callback(item, index)
        }, true);
    }
}