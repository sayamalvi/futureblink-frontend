import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  subLabel?: string;
  type: NodeType;
  selected?: boolean;
  template?: string;
  delayAmount?: number;
  delayType?: DelayType;
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
  content: string;
  subject: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'template-1',
    name: 'Sample Template - Follow Up',
    description: 'added by Sayam Alvi',
    subject: 'Following up on our conversation',
    content: 'Hi {{name}},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation.\n\nBest regards,\nSalesBlink Team'
  }
]; 