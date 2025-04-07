import { Hourglass, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface BlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmailBlock: () => void;
  onSelectDelayBlock: () => void;
}

export function BlocksModal({
  isOpen,
  onClose,
  onSelectEmailBlock,
  onSelectDelayBlock,
}: BlocksModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Blocks</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 mb-4">Click on a block to configure and add it in sequence.</p>
        <div className="space-y-4">
          <h3 className="font-medium">Outreach</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
              onClick={onSelectEmailBlock}
            >
              <div className="bg-purple-100 p-2 rounded">
                <User />
              </div>
              <div>
                <div className="font-medium">Cold Email</div>
                <div className="text-sm text-gray-500">Send an email to a lead.</div>
              </div>
            </div>
            <div
              className="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
              onClick={onSelectDelayBlock}
            >
              <div className="bg-blue-100 p-2 rounded">
                <Hourglass />
              </div>
              <div>
                <div className="font-medium">Wait</div>
                <div className="text-sm text-gray-500">Add a delay between blocks.</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 