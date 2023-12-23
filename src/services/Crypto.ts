
export type IterationCallback = (value: number) => void;

// Helper functions 
export async function encryptData(file: File, passphrase: string, iterations: number, iterationCallback: IterationCallback | undefined = undefined): Promise<Uint8Array> {
    let buffer = new Uint8Array(await file.arrayBuffer());

    for (let i: number = 0; i < iterations; i++) {
        buffer = await encryptFile(buffer, passphrase);

        if (iterationCallback != null) {
            iterationCallback(i + 1);
        }
    }

    return buffer;
}

export async function decryptData(encryptedData: Uint8Array, passphrase: string, iterations: number, iterationCallback: IterationCallback | undefined = undefined): Promise<Uint8Array> {
    for (let i: number = 0; i < iterations; i++) {
        encryptedData = await decryptFile(encryptedData, passphrase);

        if (iterationCallback != null) {
            iterationCallback(i + 1);
        }
    }

    return encryptedData;
}

/// Actual crypto stuff

export async function encryptFile(fileBuffer: Uint8Array, passphrase: string): Promise<Uint8Array> {

    // Convert passphrase to UTF-8 encoded array buffer
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);

    // Generate a key from the passphrase using PBKDF2
    const key = await crypto.subtle.importKey(
        'raw',
        passphraseBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    // Derive a key for AES-GCM from the passphrase key
    const aesKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // Encrypt the file using AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        fileBuffer
    );

    // Combine IV and encrypted data into a single Uint8Array
    const resultBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(iv, 0);
    resultBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

    return resultBuffer;
}

export async function decryptFile(encryptedFile: Uint8Array, passphrase: string): Promise<Uint8Array> {
    // Convert passphrase to UTF-8 encoded array buffer
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);

    // Generate a key from the passphrase using PBKDF2
    const key = await crypto.subtle.importKey(
        'raw',
        passphraseBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    // Derive a key for AES-GCM from the passphrase key
    const aesKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // Split IV and encrypted data from the combined array buffer
    const iv = encryptedFile.slice(0, 12);
    const encryptedData = encryptedFile.slice(12);

    // Decrypt the file using AES-GCM
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        encryptedData
    );

    return new Uint8Array(decryptedBuffer);
}


// Helper functions

export async function generateRandomIV(): Promise<Uint8Array> {
    return crypto.getRandomValues(new Uint8Array(16)) // 16 bytes for AES-CBC
}

export async function hashStringToSHA256(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log(hashHex);
    return hashHex;
}