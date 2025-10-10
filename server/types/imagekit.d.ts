declare module '@imagekit/nodejs' {
    import { ReadStream } from 'fs';

    interface ImageKitOptions {
        publicKey: string;
        privateKey: string;
        urlEndpoint: string;
    }

    interface UploadOptions {
        file: Buffer | ReadStream;
        fileName: string;
        folder?: string;
    }

    interface UrlOptions {
        path: string;
        transformation?: Array<{ [key: string]: string }>;
    }

    interface UploadResponse {
        url: string;
        filePath: string;
    }

    class ImageKit {
        constructor(options: ImageKitOptions);
        upload(options: UploadOptions): Promise<UploadResponse>;
        url(options: UrlOptions): string;
    }

    export default ImageKit;
}