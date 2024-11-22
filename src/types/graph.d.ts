export interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  link_count: number;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export interface Graph {
  nodes: Node[];
  links: Link[];
}
