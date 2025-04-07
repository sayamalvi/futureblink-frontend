import { useCallback } from "react";
import { Node } from "@xyflow/react";
import { List } from "../types/flow";
import { EMAIL_TEMPLATES } from "../types/flow";

interface UseSequenceHandlersProps {
  nodes: Node[];
  selectedList: List | null;
  hasEmailNode: boolean;
  setIsSaving: (isSaving: boolean) => void;
  showNotification: (message: string, type: "success" | "error") => void;
}

export const useSequenceHandlers = ({
  nodes,
  selectedList,
  hasEmailNode,
  setIsSaving,
  showNotification,
}: UseSequenceHandlersProps) => {
  const processSequence = useCallback(async () => {
    if (!selectedList) {
      showNotification("Please select a lead source first", "error");
      return null;
    }

    if (!hasEmailNode) {
      showNotification("Please add an email node to your sequence", "error");
      return null;
    }

    setIsSaving(true);
    try {
      const emailNode = nodes.find((node) => node.type === "cold-email");
      const delayNode = nodes.find((node) => node.type === "delay");

      // Calculate delay time in minutes
      let delay = 0;
      if (delayNode) {
        const amount = Number(delayNode.data.delayAmount) || 0;
        const type = delayNode.data.delayType;

        switch (type) {
          case "hours":
            delay = amount * 3600;
            break;
          case "days":
            delay = amount * 86400;
            break;
          default:
            delay = amount;
        }
      }

      // Calculate the scheduled time by adding delay to current time
      if (emailNode) {
        const template = EMAIL_TEMPLATES.find(
          (t) => t.name === emailNode.data.template
        );
        if (!template) {
          throw new Error("Email template not found");
        }

        // Create email requests for all leads
        const emailRequests = selectedList.leads.map((lead) => ({
          time: delay,
          emailBody: template.content.replace("{{name}}", lead.name),
          subject: template.subject,
          to: lead.email,
        }));

        return emailRequests;
      }
      return null;
    } catch (error) {
      console.error("Error processing sequence:", error);
      showNotification("Error processing sequence", "error");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [nodes, selectedList, hasEmailNode, setIsSaving, showNotification]);

  return { processSequence };
};
