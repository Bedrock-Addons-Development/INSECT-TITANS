/** @type {GeneratorFunction} */
export const GeneratorFunction = Object.getPrototypeOf(function* () { });
/** @type {GeneratorFunctionConstructor} */
export const GeneratorFunctionConstructor = GeneratorFunction.constructor;
/** @type {Generator} */
export const Generator = GeneratorFunction.prototype;
/** @type {AsyncGeneratorFunction} */
export const AsyncGeneratorFunction = Object.getPrototypeOf(async function* () { });
/** @type {AsyncGeneratorFunctionConstructor} */
export const AsyncGeneratorFunctionConstructor = AsyncGeneratorFunction.constructor;
/** @type {AsyncGenerator} */
export const AsyncGenerator = AsyncGeneratorFunction.prototype;
/** @type {FunctionConstructor} */
export const AsyncFunctionConstructor = Object.getPrototypeOf(async function () { }).constructor;

/**@type {<T extends {}, U>(target: T, source: U, getObj?: boolean)=> U}*/
var OverTakesJS; {
    const { defineProperties, getOwnPropertyDescriptors, getPrototypeOf, setPrototypeOf } = Object;//@ts-ignore
    OverTakesJS = function (prototype, object, getObject = false) {
        prototype ||= this;
        const prototypeOrigin = setPrototypeOf(defineProperties({}, getOwnPropertyDescriptors(prototype)), getPrototypeOf(prototype));
        setPrototypeOf(object, prototypeOrigin);
        defineProperties(prototype, getOwnPropertyDescriptors(object));
        return getObject ? object : prototypeOrigin;
    };
    globalThis.OverTakesJS = OverTakesJS;
};


import { MinecraftDimensionTypes, system, world } from '@minecraft/server';
import './dynamic.js';

const { scoreboard, afterEvents } = world,
    overworld = world.getDimension(MinecraftDimensionTypes.overworld),
    nether = world.getDimension(MinecraftDimensionTypes.nether),
    theEnd = world.getDimension(MinecraftDimensionTypes.theEnd);


const ObjectPrototype = {
    formatXYZ() { return `§2X§8:§q${this.z} §4Y§8:§c${this.z} §tZ§8:§9${this.z}`; }
}
const globalThisPrototype = {
    GeneratorFunction,
    GeneratorFunctionConstructor,
    AsyncGeneratorFunction,
    AsyncGeneratorFunctionConstructor,
    AsyncFunctionConstructor,
    print: console.warn,
    setInterval: system.runInterval.bind(system),
    setTimeout: system.runTimeout.bind(system),
    clearInterval: system.clearRun.bind(system),
    clearTimeout: system.clearRun.bind(system),
    run: function (callBack) { return Promise.resolve().then(callBack) },
    runCommandAsync: overworld.runCommandAsync.bind(overworld),
    sleep: (n) => new Promise(res => setTimeout(res, n)),
    errorHandle: er => console.error(er?.name ?? er, er?.message ?? '', er?.stack ?? ""),
    system, world, events: afterEvents, scoreboard,
    worldInitialized: new Promise(res => afterEvents.worldInitialize.subscribe(res)), overworld, nether, theEnd,
    gameInitialized: new Promise(res => system.events?.gameInitialize.subscribe(res))
};


const globalThisProperties = {
    currentTick: { get() { return system.currentTick; } },
    getObjective: {
        value(obj, remove = false) {
            return !remove ? scoreboard.getObjective(obj) ?? scoreboard.addObjective(obj, obj) : scoreboard.removeObjective(obj)
        }
    }
}
{

    const timeOut = res => setTimeout(() => res(system.currentTick + 1))
    globalThisProperties.nextTick = { get() { return new Promise(timeOut); } }
}

const DatePrototype = {
    toHHMMSS() { return this.toTimeString().split(' ')[0]; }
}
const MathPrototype = {
    deg(number) { return (number * 180) * this.PI }, //degresses
    rad(number) { return (number * this.PI) / 180 }, //radians
    randomBetween(max, min = 0) {
        const [n, x] = max > min ? [max, min] : [min, max]
        return this.random() * (x - n) + n;
    }
}


const NumberPrototype = {
    unitFormat(place = 1, space = "", exponent = 3, component = 1) {
        for (let i = 0, n = this, c = 10 ** (exponent + component), e = 10 ** exponent; true; i++) {
            if (n >= c) {
                n /= e;
                continue;
            }
            return nFix(n, place) + space + (Number.unitTypes[i] ?? "");
        }
    },
    floor() { return ~~this },
    toHHMMSS() { return new Date(this).toHHMMSS(); }
}
const NumberType = {
    unitTypes: ['', 'k', 'M', 'G', 'T', 'E'],
    createUID() { return `${~~(__date_clock() / 1000000)}-${system.currentTick}-${~~(Math.random() * 900 + 100)}`; }
}
const ArrayProperties = {
    x: { get() { return this[0] } },
    y: { get() { return this[1] } },
    z: { get() { return this[2] } },
    randomElement: { get() { return this[Math.floor(Math.random() * this.length)]; } },
    remove: {
        value(value) {
            let i = this.indexOf(value);
            if (i > -1) this.splice(i, 1);
            return this;
        }
    },
    removeAll: {
        value(value) {
            for (let i = this.length; i--;) {
                if (this[i] === value) this.splice(i, 1);
            }
            return this;
        }
    }
}

Symbol.isGenerator = Symbol('Symbol.isGenerator');
GeneratorFunction.prototype[Symbol.isGenerator] = true;
GeneratorFunction.isGenerator = function isGenerator(generator) { return (generator[Symbol.isGenerator] === true); }
console.logLike = console.log;
console.log = console.warn;


Object.assign(Object.prototype, ObjectPrototype);
Object.assign(globalThis, globalThisPrototype);
Object.assign(Date.prototype, DatePrototype);
Object.assign(Math, MathPrototype);
Object.assign(Number.prototype, NumberPrototype);
Object.assign(Number, NumberType);

Object.defineProperties(Array.prototype, ArrayProperties)
Object.defineProperties(globalThis, globalThisProperties);

function nFix(num, place) {
    let n = "" + num;
    let n2 = n.split('.');
    if (n2.length == 1) return n;
    else if (n2[1]?.length < place) return n;
    else return num.toFixed(place);

}