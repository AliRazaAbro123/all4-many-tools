import React from 'react';
import { PdfToImageTool } from './PdfToImageTool';
import { ImageToPdfTool } from './ImageToPdfTool';
import { ImageResizerTool } from './ImageResizerTool';
import { ImageConverterTool } from './ImageConverterTool';
import { ImageCompressorTool } from './ImageCompressorTool';
import { ImageCropperTool } from './ImageCropperTool';
import { ColorPickerTool } from './ColorPickerTool';
import { PdfMergeTool } from './PdfMergeTool';
import { PdfSplitTool } from './PdfSplitTool';
import { PdfWatermarkTool } from './PdfWatermarkTool';
import { SvgConverterTool } from './SvgConverterTool';
import { TextToPdfTool } from './TextToPdfTool';
import { FaviconGeneratorTool } from './FaviconGeneratorTool';
import { ImageFiltersTool } from './ImageFiltersTool';
import { Base64ImageTool } from './Base64ImageTool';
import { ExifViewerTool } from './ExifViewerTool';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { WordCounterTool } from './WordCounterTool';
import { PdfWordCounterTool } from './PdfWordCounterTool';
import { ImageWordCounterTool } from './ImageWordCounterTool';
import { QrCodeGeneratorTool } from './QrCodeGeneratorTool';
import { JsonFormatterTool } from './JsonFormatterTool';
import { CaseConverterTool } from './CaseConverterTool';
import { HashGeneratorTool } from './HashGeneratorTool';
import { UrlEncoderTool } from './UrlEncoderTool';
import { UuidGeneratorTool } from './UuidGeneratorTool';
import { LoremIpsumTool } from './LoremIpsumTool';
import { UnitConverterTool } from './UnitConverterTool';
import { ColorConverterTool } from './ColorConverterTool';
import { TextDiffTool } from './TextDiffTool';
import { RandomNumberTool } from './RandomNumberTool';

export const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'pdf-to-image': PdfToImageTool,
  'image-to-pdf': ImageToPdfTool,
  'image-resizer': ImageResizerTool,
  'image-converter': ImageConverterTool,
  'image-compressor': ImageCompressorTool,
  'image-cropper': ImageCropperTool,
  'color-picker': ColorPickerTool,
  'pdf-merge': PdfMergeTool,
  'pdf-split': PdfSplitTool,
  'pdf-watermark': PdfWatermarkTool,
  'svg-converter': SvgConverterTool,
  'text-to-pdf': TextToPdfTool,
  'favicon-generator': FaviconGeneratorTool,
  'image-filters': ImageFiltersTool,
  'base64-image': Base64ImageTool,
  'exif-viewer': ExifViewerTool,
  'password-generator': PasswordGeneratorTool,
  'word-counter': WordCounterTool,
  'pdf-word-counter': PdfWordCounterTool,
  'image-word-counter': ImageWordCounterTool,
  'qr-code-generator': QrCodeGeneratorTool,
  'json-formatter': JsonFormatterTool,
  'case-converter': CaseConverterTool,
  'hash-generator': HashGeneratorTool,
  'url-encoder': UrlEncoderTool,
  'uuid-generator': UuidGeneratorTool,
  'lorem-ipsum': LoremIpsumTool,
  'unit-converter': UnitConverterTool,
  'color-converter': ColorConverterTool,
  'text-diff': TextDiffTool,
  'random-number': RandomNumberTool,
};
