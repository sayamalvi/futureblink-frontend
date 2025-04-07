import { useState } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { FlowNode, FlowEdge, List } from '../types/flow';

const initialNodes: FlowNode[] = [
    {
        id: 'add-source',
        type: 'add-source',
        position: { x: 250, y: 0 },
        data: {
            label: 'Add Lead Source',
            subLabel: 'Click to add leads from List or CRM',
            type: 'add-source'
        }
    },
    {
        id: 'sequence-start',
        type: 'sequence-start',
        position: { x: 250, y: 150 },
        data: {
            label: 'Sequence Start Point',
            type: 'sequence-start'
        }
    },
];

type SetNodes = (nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])) => void;
type SetEdges = (edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])) => void;

export const useFlowState = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [hasEmailNode, setHasEmailNode] = useState(false);
    const [hasDelayNode, setHasDelayNode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    return {
        nodes,
        setNodes: setNodes as SetNodes,
        onNodesChange,
        edges,
        setEdges: setEdges as SetEdges,
        onEdgesChange,
        selectedList,
        setSelectedList,
        hasEmailNode,
        setHasEmailNode,
        hasDelayNode,
        setHasDelayNode,
        isSaving,
        setIsSaving
    };
}; 