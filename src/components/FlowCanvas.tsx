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
import { NotificationModal } from './modals/NotificationModal';
import { FlowNode, EMAIL_TEMPLATES, DelayType } from '../types/flow';
import { Button } from './ui/button';
import { useSequenceHandlers } from '../hooks/useSequenceHandlers';
import { Rocket } from 'lucide-react';

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
        position: { x: 250, y: 150 },
        data: {
            label: 'Sequence Start Point',
            type: 'sequence-start'
        },
        draggable: false
    },
];

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface List {
    id: string;
    name: string;
    leads: Lead[];
}

export const FlowCanvas: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isBlocksModalOpen, setIsBlocksModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedList, setSelectedList] = useState<List | null>(null);
    const [hasEmailNode, setHasEmailNode] = useState(false);
    const [hasDelayNode, setHasDelayNode] = useState(false);

    const [notification, setNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    const showNotification = (title: string, message: string) => {
        setNotification({
            isOpen: true,
            title,
            message,
        });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const onConnect = useCallback(
        (params: Connection) => {
            const edge = addEdge(params, edges);
            if (edge) {
                setEdges(edge);
            }
        },
        [edges, setEdges]
    );

    const handleNodeClick = (_event: React.MouseEvent, node: FlowNode) => {
        if (node.data.type === 'add-source') {
            setSelectedNode(node);
            setIsListModalOpen(true);
        } else if (node.data.type === 'sequence-start') {
            if (hasEmailNode && hasDelayNode) {
                showNotification(
                    'Maximum Nodes Reached',
                    'You can only add one email and one delay node'
                );
                return;
            }
            setIsBlocksModalOpen(true);
        }
    };

    const handleListSelection = (list: List) => {
        setSelectedList(list);
        if (selectedNode) {
            const updatedNodes = nodes.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: 'Leads from',
                            subLabel: list.name,
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
            setEdges([newEdge]);
        }
        setIsListModalOpen(false);
    };

    const handleEmailSelection = () => {
        if (hasEmailNode) {
            showNotification(
                'Email Node Limit',
                'You can only add one email node'
            );
            setIsBlocksModalOpen(false);
            return;
        }
        setIsBlocksModalOpen(false);
        setIsEmailModalOpen(true);
    };

    const handleDelaySelection = () => {
        if (hasDelayNode) {
            showNotification(
                'Delay Node Limit',
                'You can only add one delay node'
            );
            setIsBlocksModalOpen(false);
            return;
        }
        setIsBlocksModalOpen(false);
        setIsDelayModalOpen(true);
    };

    const handleEmailInsert = (templateId: string) => {
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
            },
            draggable: false
        };

        const sourceId = hasDelayNode ? 'delay-node' : 'sequence-start';
        const newEdge: Edge = {
            id: 'email-edge',
            source: sourceId,
            target: 'email-node',
            type: 'smoothstep',
        };

        setNodes((nds) => [...nds.filter(n => n.id !== 'email-node'), newNode]);
        setEdges((eds) => [...eds.filter(e => !e.target.includes('email')), newEdge]);
        setHasEmailNode(true);
        setIsEmailModalOpen(false);
    };

    const handleDelayInsert = (amount: number, type: DelayType) => {
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
            },
            draggable: false
        };

        const newEdge: Edge = {
            id: 'delay-edge',
            source: 'sequence-start',
            target: 'delay-node',
            type: 'smoothstep',
        };

        // If email node exists and is at y:300, move it down
        if (hasEmailNode) {
            setNodes((nds) => {
                const updatedNodes = nds.map(node => {
                    if (node.id === 'email-node') {
                        return {
                            ...node,
                            position: { ...node.position, y: 450 }
                        };
                    }
                    return node;
                });
                return [...updatedNodes.filter(n => n.id !== 'delay-node'), newNode];
            });

            // Update email edge to connect from delay node
            setEdges((eds) => [
                ...eds.filter(e => !e.target.includes('delay') && !e.target.includes('email')),
                newEdge,
                {
                    id: 'email-edge',
                    source: 'delay-node',
                    target: 'email-node',
                    type: 'smoothstep',
                }
            ]);
        } else {
            setNodes((nds) => [...nds.filter(n => n.id !== 'delay-node'), newNode]);
            setEdges((eds) => [...eds.filter(e => !e.target.includes('delay')), newEdge]);
        }

        setHasDelayNode(true);
        setIsDelayModalOpen(false);
    };

    const { processSequence } = useSequenceHandlers({
        nodes,
        selectedList,
        hasEmailNode,
        setIsSaving,
        showNotification: (message, type) => {
            // Implement notification system
            console.log(message, type);
        },
    });

    const handleSaveSequence = useCallback(async () => {
        const emailRequests = await processSequence();
        if (emailRequests) {
            try {
                await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/outreach/schedule`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailRequests),
                });
                console.log('Sequence saved and scheduled successfully!');
            } catch (error) {
                console.error('Error saving sequence:', error);
            }
        }
    }, [processSequence]);

    return (
        <div className="flex flex-col w-full h-[800px]">
            <div className="flex justify-end p-4">
                <Button
                    className='bg-blue-500 text-white'
                    onClick={handleSaveSequence}
                    disabled={!selectedList || !hasEmailNode || isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Sequence'}
                    <Rocket />
                </Button>
            </div>
            <div className="flex-1">
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
            </div>

            <ListSelectionModal
                lists={[
                    {
                        id: "sample-list",
                        name: "Sample List",
                        leads: [
                            { id: "1", name: "Sayam", email: "sayam.alvi18@gmail.com", phone: "1234567890" },
                            { id: "2", name: "Sayam", email: "sayam.a@saudebazi.com", phone: "1234567890" },
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

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                message={notification.message}
            />
        </div>
    );
} 