import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  
  export function CellWithTooltip({ children }: { children: React.ReactNode }) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-full truncate cursor-help">
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-sm">
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  