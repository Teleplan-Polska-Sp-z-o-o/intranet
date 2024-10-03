// Define the structure for the attachment
interface IEmailAttachment {
  filename: string; // Name of the file
  path?: string; // File path or URL
  content?: Buffer | string; // Direct content
  contentType?: string; // MIME type (optional)
}

export { IEmailAttachment };
