import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../lib/utils';
import { Plus, Users } from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    subLabel?: string;
    type: string;
    selected?: boolean;
  };
  isConnectable: boolean;
}

export const CustomNode = memo(({ data, isConnectable }: CustomNodeProps) => {
  const isAddSource = data.type === 'add-source';
  const isSequenceStart = data.type === 'sequence-start';
  const isSelected = data.selected;

  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg bg-white border-2 min-w-[200px]',
      isSelected && 'border-blue-500',
      !isSelected && 'border-gray-200',
      isSequenceStart && 'cursor-pointer hover:bg-gray-50'
    )}>
      {isAddSource && (
        <>
          <div className="flex items-center gap-2">
            {isSelected ? (
              <div className="w-8 h-8 rounded bg-pink-100 flex items-center justify-center">
                <Users className='w-5 h-5 text-pink-500' />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Plus className='w-5 h-5 text-gray-400' />
              </div>
            )}
            <div>
              <div className="font-medium text-sm">{data.label}</div>
              {data.subLabel && (
                <div className="text-sm text-gray-500">{data.subLabel}</div>
              )}
            </div>
          </div>
        </>
      )}

      {isSequenceStart && (
        <div className="text-center font-medium text-sm flex items-center justify-center gap-2">
          <Plus className='w-5 h-5 text-gray-400' />
          {data.label}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
}); 