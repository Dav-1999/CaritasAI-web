<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <main>
    <div class="graph-container" ref="graphContainer"></div>
  </main>
  <aside v-if="status.showSidePanel" ref="sidePanelRef">
    <div id="resize-handle" @mousedown="startResizing"></div>
    <div id="side-panel">
      <h1 id="title">
        <a :href="articleData.zhihuLink">{{ articleData.title }}</a>
      </h1>
      <!-- 元信息 -->
      <div id="meta">
        <!-- 收藏数和阅读数 -->
        <span id="favorites-count">收藏数：{{ articleData.favoritesCount }}</span>
        <span id="read-count">阅读数：{{ articleData.readCount }}</span>
      </div>
      <!-- 关联文章列表 -->
      <div id="related-articles" v-if="relatedArticles.length">
        <h2>关联文章</h2>
        <!-- 标签列表 -->
        <div class="tag-list" :class="{ 'collapsed': isCollapsed }" ref="tagListRef">
          <span class="tag" v-for="article in relatedArticles" :key="article.id">
            <a :href="`https://api.caritas.pro/article/${article.id}`">{{ article.name }}</a>
          </span>
        </div>
        <!-- 折叠/展开按钮 -->
        <button v-if="showToggleButton" @click="toggleCollapse">{{ isCollapsed ? '展开更多' : '收起' }}</button>
      </div>
      <!-- 渲染文章内容 -->
      <div id="content" class="article-content" v-html="articleContent"></div>
    </div>
  </aside>
</template>


<script setup lang="ts">
import * as d3 from 'd3';
import { marked } from 'marked';
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
  initZoom: 0.06,

  minSize: 1,
  maxSize: 30,


  initAlpha: 1,
  initOffsetPos: [300, 300],
  alphaDecay: 0,
  // force
  linkDistance: 5000,
  linkStrength: .2,
  linkIterations: 1,
  velocityDecay: 0.6,
  // 精度，默认0.9
  chargeTheta: 0.9,
  chargeStrength: -900,
  // 设置节点远离的范围
  chargeDistanceMax: 4000,
  chargeDistanceMin: 1,
  enableChargeForce: true,
  collideRadius: 2,
  collideStrength: .8,
  collideIterations: 1,
  enableCollideForce: true,
  centerForceStrength: 1,
  enableCenterForce: true,
  // 径向力，用于居中
  enableRadialForce: false,
  radialStrength: 0.8,
  centerX: 0,
  centerY: 0,
  minRadius: 50,
  maxRadius: 500,
  // 永久仿真
  permanentAnim: true,
  // 拖拽更新节点
  isDragNeedUpdate: true,
  // 优化参数，自动计算节点数量，自动调整力的参数
  animOptimization: false,
});

const status = reactive({
  curZoom: props.initZoom,
  curAlpha: props.initAlpha,
  dragging: false,
  curNode: {} as Node,
  width: 0,
  height: 0,
  showSidePanel: false,
  hoverNode: new Set<Node>(),
  hoverLink: new Set<Link>(),
  hoverName: new Set<Node>(),
});

const graphContainer = ref<HTMLElement | null>(null);

const articleData = reactive({
  title: '',
  zhihuLink: '',
  readCount: 0,
  favoritesCount: 0,
});

const articleContent = ref('');
const relatedArticles = ref<Array<{ id: string; name: string }>>([]);
const sidePanelRef = ref<HTMLElement | null>(null);
let isResizing = false;

function startResizing() {
  isResizing = true;
}

function resizeSidebar(event: MouseEvent) {
  if (isResizing && sidePanelRef.value) {
    const newWidth = window.innerWidth - event.clientX;
    sidePanelRef.value.style.width = `${newWidth}px`;
  }
}

function stopResizing() {
  isResizing = false;
}

window.addEventListener('mousemove', resizeSidebar);
window.addEventListener('mouseup', stopResizing);

// 控制标签列表的折叠状态
const isCollapsed = ref(true);
// 控制是否显示折叠/展开按钮
const showToggleButton = ref(false);
// 引用标签列表的 DOM 元素
const tagListRef = ref(null);

// 切换折叠状态的方法
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

// 检测标签列表是否溢出的方法
function checkTagsOverflow() {
  if (tagListRef.value) {
    const el = tagListRef.value as HTMLElement;
    const maxHeight = 40; // 根据标签大小调整
    if (el.scrollHeight > maxHeight) {
      showToggleButton.value = true;
    } else {
      showToggleButton.value = false;
    }
  }
}

// 监听 relatedArticles，当其更新时检测是否需要显示折叠按钮
watch(relatedArticles, () => {
  nextTick(() => {
    checkTagsOverflow();
  });
});

setInterval(() => {

  if (status.dragging) {
    // 设置高亮节点中元素的样式
    status.hoverNode.forEach((nodeData) => {
      d3.selectAll<SVGCircleElement, Node>(".node")
        .filter((d) => d.id === nodeData.id)
        .attr("fill", props.hoverColor)
        .style("opacity", 1);
    });

    status.hoverLink.forEach((linkData) => {
      d3.selectAll<SVGLineElement, Link>(".link")
        .filter((d) => {
          const link = d as Link;
          const source = link.source as Node;
          const target = link.target as Node;
          return source.id === (linkData.source as Node).id && target.id === (linkData.target as Node).id
        })
        .style("stroke", props.hoverColor)
        .style("stroke-opacity", 1);
    });

    status.hoverName.forEach((nodeData) => {
      d3.selectAll<SVGTextElement, Node>(".name")
        .filter((d) => d.id === nodeData.id)
        .style("opacity", 1);
    });
  }
}, 200);


function initGraph(container: HTMLElement | null) {
  if (!container) {
    return;
  }
  container.innerHTML = '';
  const width = container.clientWidth;
  const height = container.clientHeight;
  status.width = width;
  status.height = height;

  props.centerX = width / 2;
  props.centerY = height / 2;


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
  const degrees = nodes.map(node => node.link_count);
  const maxDegree = Math.max(...degrees);
  const minDegree = Math.min(...degrees);

  const degreeToRadius = d3.scaleLinear()
    .domain([minDegree, maxDegree])
    .range([props.minRadius, props.maxRadius]); // Inverse relation
  // 提供连接数分级大小表， 方差为108，太大了，按均值5来分5级

  const sizeScale = d3.scaleLinear()
    .domain([minDegree, maxDegree])
    .range([props.minSize, props.maxSize]); // 根据需要调整范围

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
    .attr("r", (d) => sizeScale(d.link_count) * props.nodeSize)
    .attr("fill", props.nodeColor)
    .call(
      d3
        .drag<SVGCircleElement, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;

          status.dragging = true;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0);

          status.dragging = false;
          status.curNode = {} as Node;
          d.fx = null;
          d.fy = null;
          status.hoverLink.clear();
          status.hoverNode.clear();
          status.hoverName.clear();
        })
    );

  const name = content
    .selectAll<SVGTextElement, Node>(".name")
    .data(nodes)
    .join("text")
    .attr("class", "name")
    .attr("fill", props.textColor)
    .attr("dy", (d) => sizeScale(d.link_count) * props.textYOffest)
    .attr("dx", (d) => -sizeScale(d.link_count) * props.textYOffest / 8)
    .attr("font-size", (d) => (sizeScale(d.link_count) + 1) * props.textSize)
    .text((d) => d.name);

  node
    .on("mouseover", function (event, d) {
      if (status.dragging) return;

      node.attr("fill", props.nodeColor).style("opacity", 0.2);
      link.style("stroke-opacity", 0.2);
      name.style("opacity", 0.2);

      d3.select(this).attr("fill", props.hoverColor).style("opacity", 1);
      status.hoverNode.add(d);
      status.curNode = d;

      link
        .filter((l) => l.source === d || l.target === d)
        .style("stroke", props.hoverColor)
        .style("stroke-opacity", 1)
        .each(function (l) {
          status.hoverLink.add(l);
        });


      // 高亮连接的节点和对应的标签
      status.hoverName.clear();
      // cur name
      name
        .filter((t) => t === d)
        .style("opacity", 1)
        .each(function (na) {
          status.hoverName.add(na);
        });
      node
        .filter((n) =>
          links.some(
            (l) =>
              (l.source === d && l.target === n) ||
              (l.source === n && l.target === d)
          )
        )
        .attr("fill", props.hoverColor)
        .style("opacity", 1)
        .each(function (n) {
          status.hoverNode.add(n);

          name
            .filter((t) => t === n)
            .style("opacity", 1)
            .each(function (na) {
              status.hoverName.add(na);
            });
        });

      // 关联的文字
    })
    .on("mouseout", function () {
      if (status.dragging && status.curNode.id) return;
      node.attr("fill", props.nodeColor).style("opacity", 1); // Reset nodes
      link.style("stroke", props.lineColor).style("stroke-opacity", 0.6); // Reset links
      name.style("opacity", 1); // Reset text
    })
    .on("click", async function (event, d) {
      try {
        const response = await fetch('https://api.xqher.cn/article/getArticleById?id=' + d.id);
        const data = await response.json();
        const article = data.data;
        const {
          title, question, zhihuLink, content, readCount, favoritesCount, links
        } = article;

        // 更新文章数据
        articleData.title = title || question;
        articleData.zhihuLink = zhihuLink;
        articleData.readCount = readCount;
        articleData.favoritesCount = favoritesCount;

        // 解析 Markdown 内容并更新
        const parsedContent = await marked.parse(content);
        // 使用 DOM 操作添加类名
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsedContent;
        const linksInContent = tempDiv.querySelectorAll('a');
        linksInContent.forEach(link => {
          link.classList.add('article-link');
        });
        articleContent.value = tempDiv.innerHTML;
        // 置顶
        sidePanelRef.value?.scrollTo(0, 0);

        // 更新关联文章列表
        relatedArticles.value = links.map((linkName: string) => {
          const relatedNode = nodes.find((node) => node.name === linkName);
          return relatedNode
            ? { id: relatedNode.id, name: relatedNode.name }
            : { id: '#', name: linkName };
        });

        // 显示侧栏
        status.showSidePanel = true;
      } catch (error) {
        console.error('Error fetching article:', error);
        // 处理错误，例如显示提示信息
      }
    });


  const simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .alphaDecay(props.alphaDecay)
    .alpha(props.initAlpha)
    .velocityDecay(1 - props.velocityDecay)
    .on("end", () => {
      if (props.permanentAnim) {
        simulation.alpha(props.initAlpha).restart();
      }
    })
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => { return (d as Node).id; })
        .distance((d: Link) => {
          if (props.animOptimization) {
            const source = d.source as Node;
            const target = d.target as Node;
            const degree = Math.max(source.link_count, target.link_count);
            return props.linkDistance / Math.sqrt(degree + 1); // 高连接度节点距离更短
          } else {
            return props.linkDistance;
          }
        })
        .strength((d: Link) => {
          if (props.animOptimization) {
            const source = d.source as Node;
            const target = d.target as Node;
            const degree = Math.max(source.link_count, target.link_count);
            return 1 / Math.log2(degree + 2); // 高连接度节点的链接力更弱
          } else {
            return props.linkStrength;
          }
        })
        .iterations(props.linkIterations)
    )
    .force(
      "collide",
      props.enableCollideForce
        ? d3
          .forceCollide()
          .radius((d) => {
            if (props.animOptimization) {
              return props.collideRadius;
            } else {

              const node = d as Node;
              // 高连接数节点排斥力更强
              const degree = node.link_count;
              return props.collideRadius * Math.log2(degree + 2);
            }
          })
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
          .strength((d) => {
            const node = d as Node;
            const degree = node.link_count || 1;
            return props.chargeStrength / Math.sqrt(degree + 1);
          })
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
    .force(
      "radial",
      props.enableRadialForce
        ? d3.forceRadial(
          (d: Node) => degreeToRadius(d.link_count || 1), // Radius based on degree
          props.centerX,
          props.centerY
        ).strength(props.radialStrength)
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

// 页面尺寸变化时重新加载
window.addEventListener('resize', () => {
  reload();
  nextTick(() => {
    checkTagsOverflow();
  });
});

onMounted(() => {
  reload();
  nextTick(() => {
    checkTagsOverflow();
  });
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
  width: 330px;
  height: 100vh;
  opacity: .7;
  display: flex;
  z-index: 99;
  overflow-y: auto;
  background-color: #fafafa;
  padding: 20px;

  #title {
    text-align: center;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
      text-decoration: none;
      color: #1f1f1f;
      font-size: 2rem;
    }
  }

  #meta {
    display: flex;
    justify-content: center;
  }

  #favorites-count,
  #read-count {
    margin: 0 10px;
    color: #999999;
  }

}

#resize-handle {
  position: absolute;
  top: 0;
  left: -5px;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
  z-index: 100;
}

/* 关联文章列表样式 */
#related-articles {
  margin-top: 20px;
}

#related-articles h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #008080;
  padding-bottom: 5px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-card {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.article-card a {
  text-decoration: none;
  color: #333;
}

.article-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.article-card p {
  margin: 5px 0 0;
  color: #666;
}

.article-card:hover {
  background-color: #e0f7fa;
}

.article-card a:hover h3 {
  text-decoration: underline;
}

/* 调整 aside 内链接的样式 */
::v-deep a {
  color: #008080;
  text-decoration: none;
  transition: color 0.3s;
}

::v-deep a:hover {
  color: #005f5f;
  text-decoration: underline;
}

/* blockquote */
blockquote {
  border-left: 5px solid #008080;
  background-color: #eee;
  padding: 4px 8px;
}

/* 标签列表样式 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-list.collapsed {
  max-height: 40px; /* 调整此值以控制显示的行数 */
  overflow: hidden;
}

.tag {
  background-color: #e0f7fa;
  color: #00796b;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
}

.tag a {
  color: inherit;
  text-decoration: none;
}

.tag a:hover {
  text-decoration: underline;
}

/* 折叠/展开按钮样式 */
#related-articles button {
  margin-top: 10px;
  background-color: transparent;
  border: none;
  color: #008080;
  cursor: pointer;
}

#related-articles button:hover {
  text-decoration: underline;
}

.graph-container {
  width: 100%;
  height: 100%;
}
</style>
