function isLetter(str) {
    return !(str.length !== 1 || !str.match(/[a-z]/i));
}

export default isLetter;