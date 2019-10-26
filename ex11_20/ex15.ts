import { ℤ, lessThan } from "../util";

type Coordinate = { x: number; y: number };

type PathCache = { [key: string]: number }
function toS(coord: Coordinate): string {
    return `x${coord.x}y${coord.y}`;
}

function append(cache: PathCache, coord: Coordinate, paths: number): PathCache {
    return { ...cache, [toS(coord)]: paths };
}

//yields {0,0},{0,1},{0,2},...{1,0},{1,1}... until {limits}
const latticePoints = (limits: Coordinate) =>
    ℤ()
        .takeWhile(lessThan(limits.x + 1))
        .flatMap(x => ℤ()
            .takeWhile(lessThan(limits.y + 1))
            .map(y => ({ x, y }))
        );


function addPaths(coord: Coordinate, cache: PathCache): PathCache {
    const { x, y } = coord;
    const left = { x: x - 1, y };
    const down = { x, y: y - 1 };

    const paths =
        ((x > 0) ? cache[toS(left)] : 0)
        +
        ((y > 0) ? cache[toS(down)] : 0);

    return append(cache, coord, paths);
}

const initCache: PathCache = { "x0y0": 1 };
export function ex15() {

    console.log("Ex15:", latticePoints({ x: 20, y: 20 })
        .filter(pos => toS(pos) !== "x0y0")
        .fold(addPaths, initCache
        )["x20y20"]);
}
