export interface ICryptoFile {
    data: Uint8Array | undefined;
    filename: string;
    uuid: string,
    state: string,
    startSize: number,
    iterations: number

}