import {
  Tooltip,
  TooltipContent,
  TooltipProps,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type BottomTooltipProps = {
  children: ReactNode;
  content: string;
} & TooltipProps;

/**
* Tooltip displayed at the bottom of the trigger element.
*/
export function BottomTooltip(props: BottomTooltipProps) {
  const { children, content, ...rest } = props;

  return (
    <TooltipProvider>
      <Tooltip {...rest}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={5}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
