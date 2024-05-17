import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

const MultipleUpload = ({
  fileChange,
}: {
  fileChange: (files: File[]) => void;
}) => {
  const [previews, setPreviews] = useState<(string | ArrayBuffer | null)[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileReaders: FileReader[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    fileChange(acceptedFiles);

    // Hapus pembaca setelah selesai
    fileReaders.forEach((reader) => {
      reader.onloadend = () => {
        reader.abort();
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Mengizinkan multiple upload
    accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
  });

  const handleRemoveFile = (index: number) => {
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex items-center justify-center border border-dashed p-5 cursor-pointer hover:bg-slate-50 rounded-xl"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-400 text-xs md:text-lg">Drop Disini ...</p>
        ) : (
          <p className="text-gray-400 text-xs md:text-lg">
            Drag 'n' drop file gambar, atau klik untuk memilih file gambar
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {previews.map((preview, index) => (
          <div className="relative" key={index}>
            <div className="mb-5">
              <img
                src={preview as string}
                alt={`Upload preview ${index}`}
                className="h-20 w-20"
              />
            </div>
            <button
              onClick={() => handleRemoveFile(index)}
              className="absolute -mt-2 -mr-2 top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
              aria-label="Remove image"
            >
              <p className="text-sm">
                <X className="w-4 h-4" />
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleUpload;
