import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  subLabel?: string;
  type: NodeType;
  selected?: boolean;
  [key: string]: unknown;
}

export type NodeType = 'add-source' | 'sequence-start';

export interface CustomNodeProps {
  data: NodeData;
  isConnectable: boolean;
}

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge; 