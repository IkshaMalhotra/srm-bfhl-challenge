// // processor.js

// function parseAndProcess(data) {
//   const validEdgeSet = new Set();
//   const validEdges = [];
//   const invalidEntries = [];
//   const duplicateEdges = [];

//   // Step 1: Validate each entry
//   for (let raw of data) {
//     const entry = raw.trim();

//     // Regex: exactly X->Y where X and Y are single uppercase letters
//     const isValid = /^[A-Z]->[A-Z]$/.test(entry);

//     if (!isValid) {
//       invalidEntries.push(raw); // push original (untrimmed? no — push trimmed per spec)
//       // Actually spec says trim first then validate, push original to invalid
//       continue;
//     }

//     // Self-loop check
//     const [parent, child] = entry.split('->');
//     if (parent === child) {
//       invalidEntries.push(raw);
//       continue;
//     }

//     // Duplicate check
//     if (validEdgeSet.has(entry)) {
//       if (!duplicateEdges.includes(entry)) {
//         duplicateEdges.push(entry);
//       }
//       continue;
//     }

//     validEdgeSet.add(entry);
//     validEdges.push({ parent, child });
//   }

//   // Step 2: Build adjacency with diamond rule (first-parent wins)
//   const childParentMap = new Map(); // child -> parent (first wins)
//   const adjList = new Map();        // parent -> [children]

//   for (const { parent, child } of validEdges) {
//     if (!adjList.has(parent)) adjList.set(parent, []);
//     if (!adjList.has(child)) adjList.set(child, []);

//     // Diamond: only first parent wins
//     if (!childParentMap.has(child)) {
//       childParentMap.set(child, parent);
//       adjList.get(parent).push(child);
//     }
//     // silently discard subsequent parent edges for same child
//   }

//   // Step 3: Find all nodes
//   const allNodes = new Set(adjList.keys());

//   // Step 4: Find roots — nodes that never appear as a child
//   const childNodes = new Set(childParentMap.keys());
//   const roots = [...allNodes].filter(n => !childNodes.has(n));

//   // Step 5: Group nodes into connected components (undirected)
//   const visited = new Set();
//   const components = [];

//   function dfsComponent(node, component) {
//     if (visited.has(node)) return;
//     visited.add(node);
//     component.push(node);
//     const children = adjList.get(node) || [];
//     for (const c of children) dfsComponent(c, component);
//     // Also walk up (for pure cycles where there's no clear root)
//     for (const [child, parent] of childParentMap.entries()) {
//       if (parent === node && !visited.has(child)) dfsComponent(child, component);
//     }
//   }

//   for (const node of allNodes) {
//     if (!visited.has(node)) {
//       const component = [];
//       dfsComponent(node, component);
//       components.push(component);
//     }
//   }

//   // Step 6: For each component, find its root(s) and detect cycles
//   const hierarchies = [];

//   for (const component of components) {
//     const compSet = new Set(component);
//     const compRoots = component.filter(n => !childNodes.has(n));

//     // Detect cycle using DFS
//     function hasCycle(startNode) {
//       const recStack = new Set();
//       const visitedLocal = new Set();

//       function dfs(node) {
//         visitedLocal.add(node);
//         recStack.add(node);
//         for (const child of (adjList.get(node) || [])) {
//           if (!compSet.has(child)) continue;
//           if (!visitedLocal.has(child)) {
//             if (dfs(child)) return true;
//           } else if (recStack.has(child)) {
//             return true;
//           }
//         }
//         recStack.delete(node);
//         return false;
//       }
//       return dfs(startNode);
//     }

//     // Determine if component has a cycle
//     const cycleDetected = component.some(n => hasCycle(n));

//     if (compRoots.length === 0) {
//       // Pure cycle — use lexicographically smallest node as root
//       const root = [...component].sort()[0];
//       hierarchies.push({ root, tree: {}, has_cycle: true });
//     } else {
//       for (const root of compRoots) {
//         if (cycleDetected) {
//           hierarchies.push({ root, tree: {}, has_cycle: true });
//         } else {
//           // Build nested tree
//           function buildTree(node) {
//             const children = adjList.get(node) || [];
//             const obj = {};
//             for (const child of children) {
//               obj[child] = buildTree(child);
//             }
//             return obj;
//           }

//           function calcDepth(node) {
//             const children = adjList.get(node) || [];
//             if (children.length === 0) return 1;
//             return 1 + Math.max(...children.map(calcDepth));
//           }

//           const tree = { [root]: buildTree(root) };
//           const depth = calcDepth(root);
//           hierarchies.push({ root, tree, depth });
//         }
//       }
//     }
//   }

//   // Step 7: Summary
//   const nonCyclic = hierarchies.filter(h => !h.has_cycle);
//   const cyclic = hierarchies.filter(h => h.has_cycle);

//   let largest = null;
//   for (const h of nonCyclic) {
//     if (!largest || h.depth > largest.depth ||
//       (h.depth === largest.depth && h.root < largest.root)) {
//       largest = h;
//     }
//   }

//   const summary = {
//     total_trees: nonCyclic.length,
//     total_cycles: cyclic.length,
//     largest_tree_root: largest ? largest.root : null
//   };

//   return { hierarchies, invalidEntries, duplicateEdges, summary };
// }

// module.exports = { parseAndProcess };