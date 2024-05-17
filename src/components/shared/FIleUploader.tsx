import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type FileUploaderProps = {
  fileChange: (files: File[]) => void;
  mediaUrl?: string;
  type?: string;
};

const FileUploader = ({ fileChange, mediaUrl, type }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl || "");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fileChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />
      {type === "profile" ? (
        <div className="cursor-pointer flex-center gap-4 flex items-center">
          <img
            src={fileUrl}
            alt="image"
            className="h-16 w-16 rounded-full object-cover"
          />
          <p className="text-md">Change profile photo</p>
        </div>
      ) : (
        <>
          <div className="w-full border border-dashed p-5 flex justify-center cursor-pointer">
            <p className="text-gray-400">Drag n drop gambar disini</p>
          </div>
          <div className="flex justify-center py-2">
            <img src={fileUrl} alt="image" />
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
