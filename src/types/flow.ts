import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  subLabel?: string;
  type: NodeType;
  selected?: boolean;
  template?: string;
  delayAmount?: number;
  delayType?: DelayType;
  enableABTesting?: boolean;
  [key: string]: unknown;
}

export type NodeType = 'add-source' | 'sequence-start' | 'cold-email' | 'delay';
export type DelayType = 'minutes' | 'hours' | 'days';

export interface CustomNodeProps {
  data: NodeData;
  isConnectable: boolean;
}

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge;

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Sample Template - Follow Up',
    description: 'added by SalesBlink'
  }
]; 