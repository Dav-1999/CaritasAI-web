// simulationWorker.js

// importScripts('https://d3js.org/d3.v6.min.js');

import * as d3 from 'd3'
let simulation
let nodes = []
let links = []

self.addEventListener('message', function (event) {
  const data = event.data
  switch (data.type) {
    case 'init':
      nodes = data.nodes.map(n => ({ ...n }))
      links = data.links.map(l => ({ ...l }))

      simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(data.linkDistance)
            .strength(data.linkStrength),
        )
        .force('charge', d3.forceManyBody().strength(data.chargeStrength))
        .force('center', d3.forceCenter(data.width / 2, data.height / 2))
        .on('tick', ticked)

      break

    case 'dragStart':
      const nodeStart = nodes.find(n => n.id === data.nodeId)
      if (nodeStart) {
        nodeStart.fx = nodeStart.x
        nodeStart.fy = nodeStart.y
      }
      break

    case 'drag':
      const nodeDrag = nodes.find(n => n.id === data.nodeId)
      if (nodeDrag) {
        nodeDrag.fx = data.x
        nodeDrag.fy = data.y
      }
      break

    case 'dragEnd':
      const nodeEnd = nodes.find(n => n.id === data.nodeId)
      if (nodeEnd) {
        nodeEnd.fx = null
        nodeEnd.fy = null
      }
      break

    case 'updateParams':
      // 更新仿真参数，如力的强度等
      simulation
        .force('charge', d3.forceManyBody().strength(data.chargeStrength))
        .force(
          'link',
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(data.linkDistance)
            .strength(data.linkStrength),
        )
      simulation.alpha(1).restart()
      break
    case 'pause':
      simulation.stop()
      break

    case 'resume':
      simulation.alpha(1).restart()
      break

    case 'restart':
      simulation.alpha(1).restart()
      break

    case 'stop':
      simulation.stop()
      break

    // 根据需要添加更多的消息处理
  }
})
let lastPostTime = performance.now()
function ticked() {
  const now = performance.now()
  if (now - lastPostTime >= 16) {
    const updatedNodes = nodes
      .filter(n => n.vx !== 0 || n.vy !== 0)
      .map(n => ({ id: n.id, x: n.x, y: n.y }))
    self.postMessage({
      type: 'tick',
      nodes: updatedNodes,
    })
    lastPostTime = now
  }
}
