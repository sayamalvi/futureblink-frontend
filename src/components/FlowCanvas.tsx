import { useState, useCallback } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ListSelectionModal } from './ListSelectionModal';
import { CustomNode } from './CustomNode';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Hourglass, Mail } from 'lucide-react';


const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node[] = [
    {
        id: 'add-source',
        type: 'custom',
        position: { x: 250, y: 150 },
        data: {
            label: 'Add Lead Source',
            subLabel: 'Click to add leads from List',
            type: 'add-source'
        },
        draggable: false
    },
    {
        id: 'sequence-start',
        type: 'custom',
        position: { x: 260, y: 300 },
        data: {
            label: 'Sequence Start Point',
            type: 'sequence-start'
        },
        draggable: false
    },
];

const initialEdges: Edge[] = [];

export function FlowCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBlocksModalOpen, setIsBlocksModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        if (node.data.type === 'add-source') {
            setSelectedNode(node);
            setIsModalOpen(true);
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
            setEdges([newEdge]);
        }
        setIsModalOpen(false);
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
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleListSelection}
                lists={[
                    {
                        id: "sample-list",
                        name: "Sample List",
                        leads: [
                            { id: "1", name: "Sayam", email: "sayam.alvi18@gmail.com", phone: "1234567890" },
                        ],
                    },
                ]}
            />


            <Dialog open={isBlocksModalOpen} onOpenChange={setIsBlocksModalOpen}>
                <DialogContent className="w-[600px] rounded-xl">
                    <DialogHeader>
                        <div className="flex justify-between items-center mb-2">
                            <DialogTitle className="text-xl font-semibold">Add Blocks</DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-600">
                            Click on a block to configure and add it in sequence.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <h3 className="font-medium">Outreach</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition">
                                <div className="bg-purple-100 p-2 rounded">
                                    <Mail className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Cold Email</div>
                                    <div className="text-sm text-gray-500">Send an email to a lead.</div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition">
                                <div className="bg-purple-100 p-2 rounded">
                                    <Hourglass className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Wait/Delay</div>
                                    <div className="text-sm text-gray-500">Add a delay between blocks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
} 