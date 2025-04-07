import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../../lib/utils';
import { CustomNodeProps } from '../../types/flow';

export const EmailNode = memo(({ data, isConnectable }: CustomNodeProps) => {
  const template = data.template || '';
  
  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200 min-w-[200px]'
    )}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="font-medium">Email</div>
          <div className="text-sm text-purple-500">Template: {template}</div>
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