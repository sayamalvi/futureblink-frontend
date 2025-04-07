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
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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