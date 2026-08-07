import { TbCancel } from "react-icons/tb";
import { Button } from "@/components/ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

export function CancelUploadButton({ abort }: { abort: AbortController }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => abort.abort("Canceled by user.")}
          aria-label="Cancel in-progress upload"
        >
          <TbCancel />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Cancel upload.</TooltipContent>
    </Tooltip>
  );
}
