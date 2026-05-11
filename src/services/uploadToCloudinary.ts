"use server";

import crypto from "crypto";

export const uploadToCloudinary = async (file: File, folder?: string) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;
  const apiKey = process.env.CLOUDINARY_API_KEY as string;
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;

  const timestamp = Math.floor(Date.now() / 1000);
  let paramsToSign = "";

  if (folder) {
    paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  } else {
    paramsToSign = `timestamp=${timestamp}`;
  }

  // Create signature
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  const data = new FormData();

  data.append("file", file);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp.toString());
  data.append("signature", signature);

  if (folder) {
    data.append("folder", folder);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: data,
    },
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error?.message || "Upload failed");
  }

  return result.secure_url;
};
