import { useState, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ListSelectionModal } from './modals/ListSelectionModal';
import { CustomNode } from './CustomNode';
import { EmailNode } from './nodes/EmailNode';
import { DelayNode } from './nodes/DelayNode';
import { BlocksModal } from './modals/BlocksModal';
import { EmailTemplateModal } from './modals/EmailTemplateModal';
import { DelayModal } from './modals/DelayModal';
import { FlowNode, EMAIL_TEMPLATES, DelayType } from '../types/flow';

const nodeTypes = {
    custom: CustomNode,
    'cold-email': EmailNode,
    delay: DelayNode,
};

const initialNodes: FlowNode[] = [
    {
        id: 'add-source',
        type: 'custom',
        position: { x: 250, y: 0 },
        data: {
            label: 'Add Lead Source',
            subLabel: 'Click to add leads from List or CRM',
            type: 'add-source'
        },
        draggable: false
    },
    {
        id: 'sequence-start',
        type: 'custom',
        position: { x: 280, y: 150 },
        data: {
            label: 'Sequence Start Point',
            type: 'sequence-start'
        },
        draggable: false
    },
];

export function FlowCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isBlocksModalOpen, setIsBlocksModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

    const onConnect = useCallback(
        (params: Connection) => {
            const edge = addEdge(params, edges);
            if (edge) {
                setEdges(edge);
            }
        },
        [edges, setEdges]
    )
    const handleNodeClick = (event: React.MouseEvent, node: FlowNode) => {
        if (node.data.type === 'add-source') {
            setSelectedNode(node);
            setIsListModalOpen(true);
        } else if (node.data.type === 'sequence-start') {
            setIsBlocksModalOpen(true);
        }
    };

    const handleListSelection = (selectedList: string) => {
        if (selectedNode) {
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: 'Leads from',
                            subLabel: selectedList,
                            selected: true,
                        },
                    };
                }
                return node;
            });
            setNodes(updatedNodes);

            const newEdge: Edge = {
                id: 'start-edge',
                source: 'add-source',
                target: 'sequence-start',
                type: 'smoothstep',
            };
            setEdges((eds) => [...eds, newEdge]);
        }
        setIsListModalOpen(false);
    };

    const getNextNodePosition = () => {
        const lastNode = [...nodes].sort((a, b) => b.position.y - a.position.y)[0];
        return { x: 250, y: lastNode.position.y + 150 };
    };

    const handleEmailSelection = () => {
        setIsBlocksModalOpen(false);
        setIsEmailModalOpen(true);
    };

    const handleDelaySelection = () => {
        setIsBlocksModalOpen(false);
        setIsDelayModalOpen(true);
    };

    const handleEmailInsert = (templateId: string, enableABTesting: boolean) => {
        const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        const position = getNextNodePosition();
        const newNode: FlowNode = {
            id: `email-${Date.now()}`,
            type: 'cold-email',
            position,
            data: {
                label: template.name,
                type: 'cold-email',
                template: template.name,
                enableABTesting,
            },
        };

        const lastNodeId = nodes[nodes.length - 1].id;
        const newEdge: Edge = {
            id: `edge-${Date.now()}`,
            source: lastNodeId,
            target: newNode.id,
            type: 'smoothstep',
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, newEdge]);
    };

    const handleDelayInsert = (amount: number, type: DelayType) => {
        const position = getNextNodePosition();
        const newNode: FlowNode = {
            id: `delay-${Date.now()}`,
            type: 'delay',
            position,
            data: {
                label: `Wait ${amount} ${type}`,
                type: 'delay',
                delayAmount: amount,
                delayType: type,
            },
        };

        const lastNodeId = nodes[nodes.length - 1].id;
        const newEdge: Edge = {
            id: `edge-${Date.now()}`,
            source: lastNodeId,
            target: newNode.id,
            type: 'smoothstep',
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, newEdge]);
    };

    return (
        <div className="w-full h-[800px]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>

            <ListSelectionModal
                lists={[
                    {
                        id: "sample-list",
                        name: "Sample List",
                        leads: [
                            { id: "1", name: "Sayam", email: "sayam.alvi18@gmail.com", phone: "1234567890" },
                        ],
                    },
                ]}
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                onSelect={handleListSelection}
            />

            <BlocksModal
                isOpen={isBlocksModalOpen}
                onClose={() => setIsBlocksModalOpen(false)}
                onSelectEmailBlock={handleEmailSelection}
                onSelectDelayBlock={handleDelaySelection}
            />

            <EmailTemplateModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                onInsert={handleEmailInsert}
            />

            <DelayModal
                isOpen={isDelayModalOpen}
                onClose={() => setIsDelayModalOpen(false)}
                onInsert={handleDelayInsert}
            />
        </div>
    );
} 