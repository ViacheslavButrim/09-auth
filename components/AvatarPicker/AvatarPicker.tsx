"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  onFileSelect?: (file: File) => void;
}

const AvatarPicker = ({ onFileSelect }: Props) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only images");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Max file size 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect?.(file);
    }
  };

  return (
    <div>
      {previewUrl ? (
        <Image src={previewUrl} alt="Preview" width={150} height={150} />
      ) : (
        <label>
          📷 Choose photo
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AvatarPicker;
