import { filesize } from "filesize";
import type { ReactNode } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineErrorOutline } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { CancelUploadButton } from "@/components/sections/upload-file/CancelUploadButton.tsx";
import type { UploadState } from "@/components/sections/upload-file/useFileUploads.ts";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";

type UploadedItemProps = {
  upload: UploadState;
  removeFile: (id: number) => void;
};

export function UploadedItem({ upload, removeFile }: UploadedItemProps) {
  // if (1 + 1 == 2) {
  //   upload = {
  //     ...upload,
  //     state: "queued",
  //     abort: new AbortController(),
  //   };
  // }

  const variant = useUploadedItemVariant(upload);

  return (
    <li
      className={twMerge(
        "mb-2",
        "relative flex items-center border text-sm rounded-md flex-wrap outline-none",
        "transition-colors duration-100",
        "p-4 gap-4",
      )}
    >
      <div className="flex w-full flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex w-full items-center gap-2">
          <div>{variant.icon}</div>
          <div className="me-4 truncate text-sm leading-snug font-medium">{upload.file.name}</div>
        </div>
        <div
          className={twMerge(
            "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
          )}
        >
          {variant.body}
        </div>
      </div>
      {variant.showRemoveButton && (
        <div className="absolute top-1 right-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-60 hover:opacity-100"
                onClick={() => {
                  removeFile(upload.id);
                }}
                aria-label="Remove from list"
              >
                <IoClose />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove up from this list.</TooltipContent>
          </Tooltip>
        </div>
      )}
    </li>
  );
}

type UploadedItemVariant = {
  icon: ReactNode;
  body: ReactNode;
  showRemoveButton: boolean;
};

function useUploadedItemVariant(upload: UploadState): UploadedItemVariant {
  switch (upload.state) {
    case "queued":
      return {
        icon: <Spinner className="size-6" />,
        body: (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Progress value={0} />
              <CancelUploadButton abort={upload.abort} />
            </div>
            <div className="flex flex-col text-xs">
              <div> {filesize(upload.file.size, { round: 1, pad: true })} queued...</div>
            </div>
          </div>
        ),
        showRemoveButton: false,
      };
    case "uploading":
      return {
        icon: <Spinner className="size-6" />,
        body: (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Progress value={upload.progress * 100} />
              <CancelUploadButton abort={upload.abort} />
            </div>
            <div className="flex flex-col text-xs gap-0.5">
              <div>
                {upload.bytesPerSecond
                  ? filesize(upload.bytesPerSecond, {
                      bits: true,
                      standard: "jedec",
                      round: 1,
                      pad: true,
                    }) + "/s"
                  : "Starting..."}
                {!!upload.estimatedSecondsRemaining && (
                  <>, {Math.round(upload.estimatedSecondsRemaining)} seconds remaining</>
                )}
              </div>
              <div className="flex">
                {filesize(upload.progress * upload.file.size, { round: 1, pad: true })}
                <span className="mx-1">of</span>
                {filesize(upload.file.size, { round: 1, pad: true })} uploaded
              </div>
            </div>
          </div>
        ),
        showRemoveButton: false,
      };
    case "uploaded":
      return {
        icon: <IoIosCheckmarkCircleOutline className="size-6" />,
        body: (
          <div className="flex flex-col items-center gap-2 p-1 sm:flex-row">
            <Input type="text" value={upload.url} readOnly aria-label="File Link" />
            <CopyLinkButton text={upload.url} />
          </div>
        ),
        showRemoveButton: true,
      };
    case "canceled":
      return {
        icon: <TbCancel className="size-6" />,
        body: <span className="text-slate-400">Canceled</span>,
        showRemoveButton: true,
      };
    case "errored":
      return {
        icon: <MdOutlineErrorOutline className="size-6 text-red-600" />,
        body: <span className="text-xs text-red-600">Error: {upload.error}</span>,
        showRemoveButton: true,
      };
  }
}
