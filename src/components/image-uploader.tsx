import { MdOutlineClose } from "react-icons/md";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa";

export default function ImageUploader({
  imagesToDelete,
  setImagesToDelete,
  imagesToUpload,
  setImagesToUpload,
  notUploadedImages,
  setNotUploadedImages,
  notDeletedImages,
  setNotDeletedImages,
  className,
}: {
  imagesToDelete: { image: string; index: number }[];
  setImagesToDelete: (_: { image: string; index: number }[]) => void;
  imagesToUpload: File[];
  setImagesToUpload: (_: File[]) => void;
  notUploadedImages: File[];
  setNotUploadedImages: (_: File[]) => void;
  notDeletedImages: string[];
  setNotDeletedImages: (_: string[]) => void;
  className?: string;
}) {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) {
      console.error("No file found");
      return;
    }

    setNotUploadedImages([...notUploadedImages, file]);

    setImagesToUpload([...imagesToUpload, file]);
  };

  return (
    <div className={`mt-3 flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        {notDeletedImages &&
          notDeletedImages.map((image, index) => (
            <div key={image} className="relative">
              <Button
                onClick={() => {
                  setNotDeletedImages(
                    notDeletedImages.filter((_, i) => i !== index)
                  );
                  setImagesToDelete([...imagesToDelete, { image, index }]);
                }}
                variant="round"
                size="xs"
                className="absolute right-0 top-0"
              >
                <MdOutlineClose className="text-lg" />
              </Button>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="h-20 w-20 rounded-lg object-cover"
              />
            </div>
          ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {notUploadedImages.map((file, index) => (
          <div key={file.name} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Image ${index + 1}`}
              className="h-16 w-16 rounded-lg object-cover opacity-40"
            />
            <Button
              onClick={() => {
                setNotUploadedImages(
                  notUploadedImages.filter((_, i) => i !== index)
                );
              }}
              variant="round"
              size="xs"
              className="absolute right-0 top-0"
            >
              <MdOutlineClose className="text-lg" />
            </Button>
          </div>
        ))}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          id="file-upload"
          hidden
        />
        <Button
          variant="round"
          size="icon"
          onClick={() => document.getElementById("file-upload")?.click()}
          className="bg-gray-400 dark:bg-gray-600"
        >
          <FaPlus className="text-lg" />
        </Button>
      </div>
    </div>
  );
}
