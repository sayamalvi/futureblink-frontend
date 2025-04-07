import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../../lib/utils';
import { CustomNodeProps } from '../../types/flow';

export const DelayNode = memo(({ data, isConnectable }: CustomNodeProps) => {
  const amount = data.delayAmount || 0;
  const type = data.delayType || 'days';
  
  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200 min-w-[200px]'
    )}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="font-medium">Delay</div>
          <div className="text-sm text-blue-500">Wait {amount} {type}</div>
        </div>
      </div>

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