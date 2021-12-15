export default function createSingleton(name, create) {
    const s = Symbol.for(name);
    let scope = global[s];
    if (!scope) {
        scope = {...create()};
        global[s] = scope;
    }
    return scope;
}