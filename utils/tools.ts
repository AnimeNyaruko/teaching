import { Buffer } from "buffer";

export async function blobToBase64(blob: Blob): Promise<string> {
	const arrayBuffer = await blob.arrayBuffer();
	const base64String = Buffer.from(arrayBuffer).toString("base64");
	return base64String;
}

export async function base64ToTextFile(base64: string, filename: string) {
	// Decode the base64 string
	const byteCharacters = atob(base64);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}
	const byteArray = new Uint8Array(byteNumbers);

	// Create a Blob from the byte array
	const blob = new Blob([byteArray], { type: "text/plain" });

	// Create a link element and trigger a download
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
