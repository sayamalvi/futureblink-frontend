import { useCallback } from 'react';
import { Connection } from '@xyflow/react';
import { FlowNode, FlowEdge, DelayType } from '../types/flow';
import { EMAIL_TEMPLATES } from '../types/flow';

interface UseNodeHandlersProps {
    nodes: FlowNode[];
    setNodes: (nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])) => void;
    edges: FlowEdge[];
    setEdges: (edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])) => void;
    hasEmailNode: boolean;
    setHasEmailNode: (has: boolean) => void;
    hasDelayNode: boolean;
    setHasDelayNode: (has: boolean) => void;
}

export const useNodeHandlers = ({
    setNodes,
    setEdges,
    hasDelayNode,
    setHasEmailNode,
    setHasDelayNode
}: UseNodeHandlersProps) => {
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => [...eds, { ...params, type: 'smoothstep' } as FlowEdge]);
        },
        [setEdges]
    );

    const handleEmailInsert = useCallback((templateId: string) => {
        const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        const position = { x: 250, y: hasDelayNode ? 450 : 300 };
        const newNode: FlowNode = {
            id: 'email-node',
            type: 'cold-email',
            position,
            data: {
                label: template.name,
                type: 'cold-email',
                template: template.name,
            }
        };

        const sourceId = hasDelayNode ? 'delay-node' : 'sequence-start';
        const newEdge: FlowEdge = {
            id: 'email-edge',
            source: sourceId,
            target: 'email-node',
            type: 'smoothstep',
        };

        setNodes((nds) => [...nds.filter(n => n.id !== 'email-node'), newNode]);
        setEdges((eds) => [...eds.filter(e => !e.target.includes('email')), newEdge]);
        setHasEmailNode(true);
    }, [hasDelayNode, setNodes, setEdges, setHasEmailNode]);

    const handleDelayInsert = useCallback((amount: number, type: DelayType) => {
        const position = { x: 250, y: 300 };
        const newNode: FlowNode = {
            id: 'delay-node',
            type: 'delay',
            position,
            data: {
                label: `Wait ${amount} ${type}`,
                type: 'delay',
                delayAmount: amount,
                delayType: type,
            }
        };

        const newEdge: FlowEdge = {
            id: 'delay-edge',
            source: 'sequence-start',
            target: 'delay-node',
            type: 'smoothstep',
        };

        setNodes((nds) => [...nds.filter(n => n.id !== 'delay-node'), newNode]);
        setEdges((eds) => [...eds.filter(e => !e.target.includes('delay')), newEdge]);
        setHasDelayNode(true);
    }, [setNodes, setEdges, setHasDelayNode]);

    return {
        onConnect,
        handleEmailInsert,
        handleDelayInsert
    };
}; 