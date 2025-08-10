"use server";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import {AZURE_ACCOUNT_KEY, AZURE_ACCOUNT_NAME} from "@/lib/constant";

class AzureStorage extends BlobServiceClient {
  constructor(accountName: string, accountSecret: string) {
    const credentials = new StorageSharedKeyCredential(
      accountName,
      accountSecret
    );
    const url = `https://${accountName}.blob.core.windows.net`;
    console.log({ accountName, accountSecret });
    super(url, credentials);
  }

  async downloadFile(container: string, fileName: string) {
    return await super
      .getContainerClient(container)
      .getBlobClient(fileName)
      .downloadToBuffer();
  }

  async uploadFile(container: string, file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const containerClient = super.getContainerClient(container);
    const extension = file.name.split(".").at(-1)!;
    const blobContentType = extensionToContentType(extension);
    const res = await containerClient.uploadBlockBlob(
      file.name,
      buffer,
      file.size,
      { blobHTTPHeaders: { blobContentType } }
    );
    return {
      url: `${res.blockBlobClient.url}?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D`,
      type: extension,
      name: file.name,
      size: file.size,
    };
  }

  async deleteFile(container: string, fileName: string) {
    return super
      .getContainerClient(container)
      .getBlockBlobClient(fileName)
      .delete();
  }
}

function extensionToContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/msword";
    case "xls":
    case "xlsx":
      return "application/vnd.ms-excel";
    case "ppt":
    case "pptx":
      return "application/vnd.ms-powerpoint";
    // Add more cases as needed for other file types
    default:
      return "application/octet-stream"; // Default content type for unknown extensions
  }
}

declare global {
  var azure: AzureStorage | undefined;
}

const azure = new AzureStorage(
    AZURE_ACCOUNT_NAME,
    AZURE_ACCOUNT_KEY
);

export const saveFile = async (
  file: File
): Promise<{ url: string; type: string }> => {
  const response = await azure.uploadFile("nursery", file);
  return response;
};
if (process.env.NODE_ENV !== "production") globalThis.azure = azure;
