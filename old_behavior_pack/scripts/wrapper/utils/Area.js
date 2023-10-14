import { Vector } from "@minecraft/server";

const { subtract } = Vector
export class SafeAreas extends Set {
    add(area) {
        if (!(area instanceof Area)) throw new TypeError('Is not type of area');
        return super.add(area);
    }
    remove(area) { return this.delete(area); }
    isValid(loc) {
        for (const o of this) {
            if (o.inArea(loc)) return false;
        }
        return true;
    }
}
export class Area {
    constructor(centerArea) {
        this.center = centerArea;
    }
    inArea() { return false };
}
export class CubeRadiusArea extends Area {
    constructor(center, radius) {
        super(center);
        this.radius = radius;
    }
    get location1() {
        const { center: { x, y, z }, radius: r } = this;
        return { x: x - r, y: y - r, z: z - r };
    }
    get location2() {
        const { center: { x, y, z }, radius: r } = this;
        return { x: x + r, y: y + r, z: z + r };
    }
    inArea(a) {
        const { location1: b, location2: c } = this;
        return (a.x >= b.x && a.x < c.x) && (a.y >= b.y && a.y < c.y) && (a.z >= b.z && a.z < c.z);
    }
}
export class RadiusArea extends Area {
    constructor(center, radius) {
        super(center);
        this.radius = radius;
    }
    get pR() { return this.radius ** 2; }
    inArea(loc1) {
        const { pR } = this;
        const vec = Vector.subtract(loc1, this.center);
        return (vec.x ** 2 <= pR) && (vec.y ** 2 <= pR) && (vec.z ** 2 <= pR);
    }
}
export class FromToArea extends Area {
    constructor(from, to) {
        super(from);
        this.location2 = to;
    }
    get location1() { return this.center };
    inArea(a) {
        const { location1: b, location2: c } = this;
        return (a.x >= b.x && a.x < c.x) && (a.y >= b.y && a.y < c.y) && (a.z >= b.z && a.z < c.z);
    }
}