import * as JSZip from 'jszip';

const extensionToMimeTypeMap: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Add more extensions and corresponding MIME types as needed
};

export function downloadUint8ArrayAsFile(data: Uint8Array, filename: string, mimeType: string = 'image/jpeg'): void {
    const blob = new Blob([data], { type: mimeType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Remove the link from the document body after the download
    document.body.removeChild(link);
}




export async function createZip(files: Record<string, Uint8Array>): Promise<Uint8Array> {
    const zip = new JSZip();

    // Add files to the zip
    for (const [filename, content] of Object.entries(files)) {
        zip.file(filename, content);
    }

    // Generate the zip file
    const zipFile = await zip.generateAsync({ type: 'uint8array' });

    return zipFile;
}

// Example usage:
const file1Content = new TextEncoder().encode('Content of file 1');
const file2Content = new TextEncoder().encode('Content of file 2');

const files = {
    'file1.txt': file1Content,
    'file2.txt': file2Content,
};

createZip(files)
    .then(zipFile => {
        // Do something with the generated zip file
        console.log(zipFile);
    })
    .catch(error => {
        console.error('Error creating zip file:', error);
    });