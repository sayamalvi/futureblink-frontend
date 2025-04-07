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
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useState } from 'react';
import { EmailTemplate, EMAIL_TEMPLATES } from '../../types/flow';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (templateId: string, enableABTesting: boolean) => void;
}

export function EmailTemplateModal({ isOpen, onClose, onInsert }: EmailTemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [enableABTesting, setEnableABTesting] = useState(false);

  const handleInsert = () => {
    if (selectedTemplate) {
      onInsert(selectedTemplate, enableABTesting);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cold Email</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((template: EmailTemplate) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ab-testing"
              checked={enableABTesting}
              onCheckedChange={setEnableABTesting}
            />
            <Label htmlFor="ab-testing">Enable A/Z Testing</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!selectedTemplate}>
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 