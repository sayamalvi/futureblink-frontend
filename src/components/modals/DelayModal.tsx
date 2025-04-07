import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useState } from 'react';
import { DelayType } from '../../types/flow';

interface DelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (amount: number, type: DelayType) => void;
}

export function DelayModal({ isOpen, onClose, onInsert }: DelayModalProps) {
  const [amount, setAmount] = useState<number>(1);
  const [delayType, setDelayType] = useState<DelayType>('days');

  const handleInsert = () => {
    if (amount > 0) {
      onInsert(amount, delayType);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wait</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Wait For</Label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label>Wait Type</Label>
            <Select
              value={delayType}
              onValueChange={(value: DelayType) => setDelayType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 