import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

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

interface ListSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (list: List) => void;
  lists: List[];
}

export function ListSelectionModal({ isOpen, onClose, onSelect, lists }: ListSelectionModalProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleInsert = () => {
    if (selectedListId) {
      const selectedList = lists.find((list) => list.id === selectedListId);
      if (selectedList) {
        onSelect(selectedList);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-md rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Select a List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Choose your List</h4>
            <Select
              onValueChange={(value) => setSelectedListId(value)}
              value={selectedListId || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    <div className="flex gap-2">
                      <span>{list.name} - {list.leads.length} leads</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedListId}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
