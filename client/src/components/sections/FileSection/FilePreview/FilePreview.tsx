import { useModal } from "@/hooks/use-modal";
import { getFile } from "@/lib/api/file/filesApi";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";

const FilePreview = () => {
  const { modalProps } = useModal();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const { data, error, refetch, isLoading } = useQuery({
    queryFn: async () => await getFile(modalProps!.fileName!),
    queryKey: ["file", modalProps!.fileId!],
  });

  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
      setFileType(data.type);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        An error occurred, please try again.
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  if (!previewUrl || !fileType) {
    return <div>File preview is not available.</div>;
  }

  const renderPreview = () => {
    if (fileType.startsWith("image/")) {
      return (
        <div className="flex flex-col justify-center items-center gap-6 p-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-[500px] mx-auto"
          />

          <a
            href={previewUrl}
            download
            className="w-48 py-2 px-4 bg-blue-600 text-white font-medium text-center rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Download File
          </a>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          className="w-full h-[600px] border rounded-lg"
        ></iframe>
      );
    } else if (fileType.startsWith("text/")) {
      return (
        <div className="flex flex-col justify-center items-center gap-6 p-4">
          <iframe
            src={previewUrl}
            title="File Preview"
            className="w-full max-w-4xl h-[500px] border rounded-xl shadow-lg bg-card"
          ></iframe>

          <a
            href={previewUrl}
            download
            className="w-48 py-2 px-4 bg-blue-600 text-white font-medium text-center rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Download File
          </a>
        </div>
      );
    } else {
      return (
        <a
          href={previewUrl}
          download
          className="w-48 py-2 px-4 bg-blue-600 text-white font-medium text-center rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Download File
        </a>
      );
    }
  };

  return <div>{renderPreview()}</div>;
};

export default FilePreview;
