import { Buffer } from "buffer";

export default async function blobToBase64(blob: Blob): Promise<string> {
	const arrayBuffer = await blob.arrayBuffer();
	const base64String = Buffer.from(arrayBuffer).toString("base64");
	return base64String;
}
