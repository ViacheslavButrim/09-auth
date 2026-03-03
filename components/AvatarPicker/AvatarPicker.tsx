"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

interface Props {
  profilePhotoUrl?: string;
  onFileSelect?: (file: File | null) => void;
}

const AvatarPicker = ({ profilePhotoUrl, onFileSelect }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>(profilePhotoUrl ?? "");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only images allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    onFileSelect?.(file);
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onFileSelect?.(null);
  };

  return (
    <div>
      {previewUrl ? (
        <div>
          <Image src={previewUrl} alt="Preview" width={150} height={150} />
          <button onClick={handleRemove}>❌ Remove</button>
        </div>
      ) : (
        <label>
          📷 Choose photo
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AvatarPicker;
