type GraphNode<T> = { data: T }
type Edge<T, F, G> = { from: GraphNode<F>; to: GraphNode<G>; data: T }
type Graph<NT, ET> = Edge<ET, NT, NT>[];

//   A --1--B--1--E
//   |      |     |
//   2      6     /
//   |      |   1
//   C--3--D--/

const nodes: { [key: string]: GraphNode<string> } = {
    "a": { data: "A" },
    "b": { data: "B" },
    "c": { data: "C" },
    "d": { data: "D" },
    "e": { data: "E" }
};

const graph: Graph<string, number> = [
    { from: nodes["a"], to: nodes["b"], data: 1 },
    { from: nodes["a"], to: nodes["c"], data: 2 },
    { from: nodes["b"], to: nodes["a"], data: 1 },
    { from: nodes["b"], to: nodes["d"], data: 6 },
    { from: nodes["b"], to: nodes["e"], data: 1 },
    { from: nodes["c"], to: nodes["a"], data: 2 },
    { from: nodes["c"], to: nodes["d"], data: 3 },
    { from: nodes["d"], to: nodes["b"], data: 6 },
    { from: nodes["d"], to: nodes["c"], data: 3 },
    { from: nodes["d"], to: nodes["e"], data: 1 },
    { from: nodes["e"], to: nodes["b"], data: 1 },
    { from: nodes["e"], to: nodes["d"], data: 1 },
];

function onlyUnique<T>(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
}

function allNodes<NT, ET>(g: Graph<NT, ET>): GraphNode<NT>[] {
    return g.map(edge => [edge.to, edge.from])
        .reduce((acc, values) => acc.concat(values), [])
        .filter(onlyUnique);
}

function connectionsFrom<NT, ET>(g: Graph<NT, ET>, node: GraphNode<NT>): Edge<ET, NT, NT>[] {
    return g.filter(edge => edge.from === node);
}

function findExisting<T>(arr: T[], p: (t: T) => boolean): T {
    const v = arr.find(p);
    if (v === undefined) {
        throw Error;
    }
    return v;
}

type UnvisitedSetEntry = { node: GraphNode<string>; visited: boolean; distance: number; path: string };
type UnvisitedSet = UnvisitedSetEntry[];

function sortByDistanceAscending(uvs: UnvisitedSet): UnvisitedSet {
    uvs.sort((a, b) => a.distance - b.distance);
    return uvs;
}
function spf(g: Graph<string, number>, startNode: GraphNode<string>, endNode: GraphNode<string>) {
    function updateNode(uvs: UnvisitedSet, replacement: UnvisitedSetEntry): UnvisitedSet {
        return uvs.filter(i => i.node !== replacement.node).concat(replacement);
    }

    const initialUnvisitedSet: UnvisitedSet = allNodes(g).map(n => ({
        node: n,
        visited: false,
        distance: n === startNode ? 0 : Infinity,
        path:""
    }));


    function spfIteration(
        g: Graph<string, number>,
        unvisitedSet: UnvisitedSet,
        current: UnvisitedSetEntry): UnvisitedSet {

        const neighbors = connectionsFrom(g, current.node);

        const updatedNeigbours = neighbors.reduce((uvs, edge) => {
            const setEntry = findExisting(uvs, s => s.node === edge.to);
            if (setEntry.visited){
                return uvs;
            }else {
                const tentativeDistance = current.distance + edge.data;
                const replacement = (tentativeDistance < setEntry.distance)?
                { node: edge.to, visited: false, distance: tentativeDistance, path:setEntry.path + edge.from.data }:
                { node: edge.to, visited: false, distance: setEntry.distance, path:setEntry.path };
                return updateNode(uvs, replacement);
            }
        }, unvisitedSet);
        return updateNode(updatedNeigbours, { ...current, visited: true });
    }

    let uvs: UnvisitedSet = initialUnvisitedSet;
    let curr = startNode;
    while (!uvs.find(entry => entry.visited && entry.node === endNode)) {
        uvs = spfIteration(g, uvs, findExisting(uvs, e => e.node === curr));
        uvs = sortByDistanceAscending(uvs);
        const nextUnvisited = uvs.find(e=>!e.visited);
        curr = nextUnvisited? nextUnvisited.node : curr;
    }
    return uvs;

}
console.log(spf(graph,nodes["a"],nodes["d"]));
