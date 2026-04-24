const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const MY_ID = 'Iksha Malhotra'
const MY_EMAIL = 'im1737@srmist.edu.in'
const MY_ROLL = 'RA2311003030242'

function processEdges(data) {
  const seen = new Set()
  const valid = []
  const invalid = []
  const dupes = []

  for (let raw of data) {
    const entry = raw.trim()

    // must be exactly X->Y, single uppercase letters, no self loops
    if (!/^[A-Z]->[A-Z]$/.test(entry) || entry[0] === entry[3]) {
      invalid.push(raw)
      continue
    }

    if (seen.has(entry)) {
      if (!dupes.includes(entry)) dupes.push(entry)
      continue
    }

    seen.add(entry)
    valid.push({ from: entry[0], to: entry[3] })
  }

  // build parent-child relationships (diamond case)
  const parent = {}   // child -> its parent
  const kids = {}     // node -> its children

  for (const { from, to } of valid) {
    if (!kids[from]) kids[from] = []
    if (!kids[to]) kids[to] = []

    if (parent[to] === undefined) {
      parent[to] = from
      kids[from].push(to)
    }
    // silently drop if node already has a parent
  }

  const allNodes = Object.keys(kids)
  console.log('nodes found:', allNodes)

  // walk a connected component from any starting node
  const visited = new Set()
  const groups = []

  function walk(node, group) {
    if (visited.has(node)) return
    visited.add(node)
    group.push(node)
    for (const child of kids[node] || []) walk(child, group)
    // also walk up so we don't miss anything
    for (const n of allNodes) {
      if (parent[n] === node && !visited.has(n)) walk(n, group)
    }
  }

  for (const node of allNodes) {
    if (!visited.has(node)) {
      const group = []
      walk(node, group)
      groups.push(group)
    }
  }

  const hierarchies = []

  for (const group of groups) {
    // root = node that isn't anyone's child
    const roots = group.filter(n => parent[n] === undefined)

    // cycle check via dfs
    function isCyclic(start) {
      const stack = new Set()
      const done = new Set()
      function dfs(n) {
        if (done.has(n)) return false
        if (stack.has(n)) return true
        stack.add(n)
        for (const child of kids[n] || []) {
          if (dfs(child)) return true
        }
        stack.delete(n)
        done.add(n)
        return false
      }
      return dfs(start)
    }

    const hasCycle = group.some(n => isCyclic(n))

    if (roots.length === 0) {
      // pure cycle: pick lex smallest as root
      const root = [...group].sort()[0]
      hierarchies.push({ root, tree: {}, has_cycle: true })
      continue
    }

    for (const root of roots) {
      if (hasCycle) {
        hierarchies.push({ root, tree: {}, has_cycle: true })
      } else {
        function buildTree(n) {
          const obj = {}
          for (const child of kids[n] || []) obj[child] = buildTree(child)
          return obj
        }

        function depth(n) {
          const children = kids[n] || []
          if (!children.length) return 1
          return 1 + Math.max(...children.map(depth))
        }

        hierarchies.push({
          root,
          tree: { [root]: buildTree(root) },
          depth: depth(root)
        })
      }
    }
  }

  const trees = hierarchies.filter(h => !h.has_cycle)
  const cycles = hierarchies.filter(h => h.has_cycle)

  let biggest = null
  for (const t of trees) {
    if (!biggest || t.depth > biggest.depth || (t.depth === biggest.depth && t.root < biggest.root)) {
      biggest = t
    }
  }

  console.log(`processed: ${trees.length} trees, ${cycles.length} cycles`)

  return {
    hierarchies,
    invalid_entries: invalid,
    duplicate_edges: dupes,
    summary: {
      total_trees: trees.length,
      total_cycles: cycles.length,
      largest_tree_root: biggest?.root ?? null
    }
  }
}

app.post('/bfhl', (req, res) => {
  const { data } = req.body
  if (!Array.isArray(data)) return res.status(400).json({ error: 'data must be an array' })

  const result = processEdges(data)

  res.json({
    user_id: MY_ID,
    email_id: MY_EMAIL,
    college_roll_number: MY_ROLL,
    ...result
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`running on ${PORT}`))