'use strict';

function isLeafNode(node) {
    for(var key in node) {
        if(!node.hasOwnProperty(key)) continue;
        // It's a leaf if it has a non-object as a property
        return typeof node[key] !== 'object' || node[key] instanceof Array;
    }
    return true; // If node has no properties, it's a leaf
}

module.exports = function(config) {
    // Recursively traverse config object to down-fill common values into all leaf node objects
    config = JSON.parse(JSON.stringify(config)); // Deep copy object
    traverseNode(config, {});
    function traverseNode(node, common) {
        if(isLeafNode(node)) {
            Object.assign(node, Object.assign({}, common, node));
            return;
        }
        node.common = Object.assign({}, node.common, common);
        for(var nodeKey in node) {
            if(!node.hasOwnProperty(nodeKey) || nodeKey == 'common') continue;
            traverseNode(node[nodeKey], node.common);
        }
        delete node.common;
    }
    return function() {
        return JSON.parse(JSON.stringify(config));
    }
};