declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    color?: { dark?: string; light?: string };
  }

  function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;

  export default { toDataURL };
}
