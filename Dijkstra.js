'use strict';

var assert = require('assert');
var log = console.log;

// undirected graph
function Graph() {
    this.nodes = [];
    this.edges = {};
    this.dists = {};
}

Graph.prototype = {
    addNode: function (val) {
        if (this.nodes.indexOf(val) == -1) return;
        this.nodes.push(val);
    },

    addEdge: function (from, to, dist) {
        this._addEdge(from, to, dist);
        this._addEdge(to, from, dist);
    },

    _addEdge: function (from, to, dist) {
        if (!this.edges[from]) this.edges[from] = [];
        this.edges[from].push(to);
        this.dists[[from, to]] = dist;
    }
};

var dijkstra = function (graph, start) {
    // store visited node's distances
    var dists = {};
    
    // Staring node distance
    dists[start] = 0;

    var path = {};
    var nodes = [].concat(graph.nodes); // make a copy so we don't kill graph

    while (nodes.length) {
        var min = null;

        // Find smallest node remaining in graph
        nodes.forEach(function (node) {
            // node has been visited
            if (dists[node] != null) {
                // min not set or found smaller node
                if (min == null || dists[node] < dists[min]) {
                    min = node;
                }
            }
        });

        // no more nodes to look through
        if (min == null) {
            break;
        }

        // remove min node so we don't see it in our path anymore
        var i = nodes.indexOf(min);
        nodes.splice(i, 1);
        var curDist = dists[min];

        // For each edge for the min node, find the shortest
        // path to it's edges
        graph.edges[min].forEach(function (edge) {
            var dist = curDist + graph.dists[[min, edge]];

            // if edge found is shorter than a previously set edge
            if (dists[edge] == null || dist < dists[edge]) {
                dists[edge] = dist;
                path[edge] = min;
            }

        });
    } // END WHILE

    return path;
};

var shortestPath = function (graph, start, end) {
    var paths = dijkstra(graph, start);
    var route = [end];

    if (Object.keys(paths).length < 2) return route;

    // Traverse backwards through short path
    while (end !== start) {
        route.unshift(paths[end]);
        end = paths[end];
    }

    return route;
};

var len = 7;
var vals = new Array(len);
for (var i = 0; i < len; i += 1) {
    vals[i] = i + 1;
}

var g = new Graph();
g.nodes = vals;
g.addEdge(1, 2, 7);
g.addEdge(1, 3, 9);
g.addEdge(1, 6, 14);
g.addEdge(2, 3, 10);
g.addEdge(2, 4, 15);
g.addEdge(3, 4, 11);
g.addEdge(3, 6, 2);
g.addEdge(4, 5, 6);
g.addEdge(5, 6, 9);


//log(g);
assert(shortestPath(g, 1, 5) + '' == [1, 3, 6, 5] + '');
assert(shortestPath(g, 5, 1) + '' == [5, 6, 3, 1] + '');
assert(shortestPath(g, 2, 5) + '' == [2, 3, 6, 5] + '');
assert(shortestPath(g, 1, 4) + '' == [1, 3, 4] + '');
