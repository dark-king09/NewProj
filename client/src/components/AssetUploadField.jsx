import { useState } from "react";
import { resolveAssetUrl, siteApi } from "../services/api";

const imageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"]);

const getFileNameFromUrl = (url) => {
  if (!url) {
    return "";
  }

  return url.split("/").pop()?.split("?")[0] || "uploaded-file";
};

const isImageAsset = (url) => {
  const fileName = getFileNameFromUrl(url);
  const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "";
  return imageExtensions.has(extension || "");
};

export const AssetUploadField = ({
  token,
  label,
  value,
  onUploaded,
  accept = "image/*",
  helperText = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const resolvedUrl = resolveAssetUrl(value);
  const fileName = getFileNameFromUrl(value);
  const showImagePreview = isImageAsset(value);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const data = await siteApi.uploadAsset(token, file);
      onUploaded(data.url);
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="upload-field">
      <label>{label}</label>
      {helperText ? <p className="upload-field__hint">{helperText}</p> : null}
      <div className="upload-field__control">
        <input type="file" accept={accept} onChange={handleUpload} />
        {uploading ? <span>Uploading...</span> : null}
      </div>
      {value ? (
        <div className="upload-preview">
          {showImagePreview ? (
            <img src={resolvedUrl} alt="Uploaded asset preview" />
          ) : (
            <a href={resolvedUrl} target="_blank" rel="noreferrer" className="upload-preview__file">
              Open uploaded file: {fileName}
            </a>
          )}
        </div>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
};
