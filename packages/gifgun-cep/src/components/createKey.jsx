function createKey(caller) {
    console.log(`creating a key for ${caller ? caller : 'undefined'}`)
    var newKey = Math.random().toString(36).substr(2, 5);
    return newKey;
}

export {createKey};