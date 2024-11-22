<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <main>
    <div class="graph-container" ref="graphContainer"></div>
  </main>
  <aside v-if="status.showSidePanel">
    <div id="side-panel"></div>
  </aside>
</template>


<script setup lang="ts">
import * as d3 from 'd3';
import type { Node, Link, Graph } from '@/types/graph';
import graphData from '@/assets/graph-1996.json';
const props = reactive({
  // style
  hoverColor: "#8a5cec",
  nodeColor: "#aaaab3",
  textColor: "#fafafa",
  lineColor: "#999999",
  backgroundColor: "#1e1e1e",
  nodeSize: 14,
  textSize: 12,
  linkWidth: 1,
  textYOffest: 30,
  // graph option
  curNodeCount: 500,
  minZoom: 0.01,
  maxZoom: 10,
  initZoom: 0.01,
  initAlpha: 1,
  initOffsetPos: [600, 300],
  alphaDecay: 0,
  // force
  linkDistance: 5000,
  linkStrength: 1,
  linkIterations: 4,
  velocityDecay: 0.6,
  // 精度，默认0.9
  chargeTheta: 0.9,
  chargeStrength: -300,
  // 设置节点远离的范围
  chargeDistanceMax: Infinity,
  chargeDistanceMin: 1,
  enableChargeForce: false,
  collideRadius: 420,
  collideStrength: 1,
  collideIterations: 1,
  enableCollideForce: true,
  centerForceStrength: 1,
  enableCenterForce: false,
  // 永久仿真
  permanentAnim: true,
  // 拖拽更新节点
  isDragNeedUpdate: true,
});

const status = reactive({
  curZoom: props.initZoom,
  curAlpha: props.initAlpha,
  dragging: false,
  curNode: null,
  width: 0,
  height: 0,
  showSidePanel: false,
  hoverNode: new Set<Node>(),
  hoverLink: new Set(),
  hoverName: new Set(),
});

const graphContainer = ref<HTMLElement | null>(null);


function initGraph(container: HTMLElement | null) {
  if (!container) {
    return;
  }
  container.innerHTML = '';
  const width = container.clientWidth;
  const height = container.clientHeight;
  status.width = width;
  status.height = height;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', props.backgroundColor);

  const g = svg.append('g').attr('class', 'zoomable');

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([props.minZoom, props.maxZoom])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);
  svg.call(zoom.transform, d3.zoomIdentity.translate(props.initOffsetPos[0], props.initOffsetPos[1]).scale(props.initZoom));
}

function loadGraph(graphData: Graph) {
  if (!graphData) {
    return;
  }
  const nodes: Node[] = graphData.nodes;
  const links: Link[] = graphData.links;

  const content = d3.select(".zoomable");

  // link-size map
  // 提供连接数分级大小表， 方差为108，太大了，按均值5来分5级
  const getSizeFactor = (linkCount:number) =>{
      if (linkCount < 5) return linkCount;
      if (linkCount < 10) return 5;

      return Math.floor(linkCount / 10) + 1;
  }

  const link = content
    .selectAll<SVGLineElement, Link>(".link")
    .data(links)
    .join("line")
    .attr("class", "link")
    .attr("stroke", props.lineColor)
    .attr("stroke-width", props.linkWidth);

  const node = content
    .selectAll<SVGCircleElement, Node>(".node")
    .data(nodes)
    .join("circle")
    .attr("class", "node")
    .attr("r", (d) => getSizeFactor(d.link_count) * props.nodeSize)
    .attr("fill", props.nodeColor)
    .call(
      d3
        .drag<SVGCircleElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  const name = content
    .selectAll<SVGTextElement, Node>(".name")
    .data(nodes)
    .join("text")
    .attr("class", "name")
    .attr("fill", props.textColor)
    .attr("dy", props.textYOffest)
    .attr("font-size", props.textSize)
    .text((d) => d.name);

  const simulation = d3
    .forceSimulation(nodes)
    .alphaDecay(props.alphaDecay)
    .alpha(props.initAlpha)
    .velocityDecay(1 - props.velocityDecay)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => { return (d as Node).id; })
        .distance(props.linkDistance)
        .strength(props.linkStrength)
        .iterations(props.linkIterations)
    )
    .force(
      "collide",
      props.enableCollideForce
        ? d3
            .forceCollide()
            .radius(props.collideRadius)
            .strength(props.collideStrength)
            .iterations(props.collideIterations)
        : null
    )
    .force(
      "charge",
      props.enableChargeForce
        ? d3
            .forceManyBody()
            .theta(props.chargeTheta)
            .strength(props.chargeStrength)
            .distanceMax(props.chargeDistanceMax)
            .distanceMin(props.chargeDistanceMin)
        : null
    )
    .force(
      "center",
      props.enableCenterForce
        ? d3.forceCenter(status.width / 2, status.height / 2).strength(props.centerForceStrength)
        : null
    )
    .on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x || 0)
        .attr("y1", (d) => (d.source as Node).y || 0)
        .attr("x2", (d) => (d.target as Node).x || 0)
        .attr("y2", (d) => (d.target as Node).y || 0);

      node.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);

      name.attr("x", (d) => d.x || 0).attr("y", (d) => d.y || 0);
    });
}

function reload() {
  initGraph(graphContainer.value);
  loadGraph(graphData);
}

onMounted(() => {
  reload();
});

</script>

<style scoped>
main {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

aside {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  opacity: .7;
  display: flex;
  z-index: 99;
  overflow-y: auto;
}
.graph-container {
  width: 100%;
  height: 100%;
}
</style>
