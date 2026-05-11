/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { UploadCloud, File } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/services/uploadToCloudinary";

interface DragDropProps {
  name: string;
  label?: string;
  multiple?: boolean;
  folder?: string;
}

export function DragNDropUploader({
  name,
  label,
  multiple = false,
  folder = "group-khata",
}: DragDropProps) {
  const { setValue, resetField } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<{ value: string }[]>([]);

  // handler function for file select
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);
    setFiles(multiple ? selectedFiles : [selectedFiles[0]]);

    try {
      setLoading(true);
      const tempUrls: { value: string }[] = [];

      for (const file of selectedFiles) {
        const url = await uploadToCloudinary(file, folder);
        tempUrls.push(...uploadedUrls, { value: url });
        setUploadedUrls([...uploadedUrls, { value: url }]);
      }

      setValue(name, multiple ? tempUrls : tempUrls[0].value);
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // handler function for on drop event
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!droppedFiles.length) return;

    setFiles(multiple ? droppedFiles : [droppedFiles[0]]);

    try {
      setLoading(true);
      const tempUrls: { value: string }[] = [];

      for (const file of droppedFiles) {
        const url = await uploadToCloudinary(file, folder);
        tempUrls.push(...uploadedUrls, { value: url });
        setUploadedUrls([...uploadedUrls, { value: url }]);
      }

      setValue(name, multiple ? tempUrls : tempUrls[0].value);
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFiles([]);
    resetField(name);
  };

  return (
    <Controller
      name={name}
      render={({ fieldState: { error } }) => (
        <div className="space-y-2">
          {label && <Label htmlFor={name}>{label}</Label>}

          <label
            htmlFor={name}
            className={cn(
              "border-2 border-dashed border-primary/50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center gap-2",
              files.length > 0 && "bg-secondary/10",
              loading && "opacity-50 pointer-events-none",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e)}
          >
            <UploadCloud className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">
              {loading
                ? "Uploading..."
                : multiple
                  ? "Click or drag files to upload"
                  : "Click or drag a file to upload"}
            </span>
            <input
              id={name}
              type="file"
              hidden
              multiple={multiple}
              onChange={handleChange}
              placeholder="Upload your images. Drag and drop to upload or browse"
            />
          </label>

          {files.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="text-sm text-foreground flex items-center gap-2"
                >
                  <File className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleRemove}
                variant="destructive"
                size="sm"
                className="mt-2"
              >
                Remove {multiple ? "All" : "File"}
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
