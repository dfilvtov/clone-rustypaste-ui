import { CopyAllLinksButton } from "@/components/sections/upload-file/CopyAllLinksButton.tsx";
import { UploadedItem } from "@/components/sections/upload-file/UploadedItem.tsx";
import type { UploadState } from "@/components/sections/upload-file/useFileUploads.ts";

type UploadListProps = {
  files: readonly UploadState[];
  removeFile: (id: number) => void;
};

export function UploadList({ files, removeFile }: UploadListProps) {
  const queued = files.filter((f) => f.state === "queued" || f.state === "uploading");
  const completed = files.filter(
    (f) => f.state === "uploaded" || f.state === "errored" || f.state === "canceled",
  );

  return (
    <>
      <section>
        {queued.length > 0 && <h2 className="mb-1 font-medium">Queue</h2>}
        <ol>
          {queued.map((file) => (
            <UploadedItem key={file.id} upload={file} removeFile={removeFile} />
          ))}
        </ol>
      </section>
      <section>
        {queued.length > 0 && completed.length > 0 && (
          <h2 className="mb-1 font-medium">Completed</h2>
        )}
        <ol>
          {completed.map((file) => (
            <UploadedItem key={file.id} upload={file} removeFile={removeFile} />
          ))}
        </ol>
        <div className="mt-2 flex justify-center">
          <CopyAllLinksButton files={completed} />
        </div>
      </section>
    </>
  );
}
