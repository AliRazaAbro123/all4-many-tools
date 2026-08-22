import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';
import { loadImageFromFile, canvasToBlob, downloadFile, getCleanFileName } from '../../utils/fileHelpers';

type AspectRatio = 'free' | '1:1' | '16:9' | '4:3' | '9:16';

export const ImageCropperTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const [aspect, setAspect] = useState<AspectRatio>('free');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Crop box parameters in percentages (0-100)
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    try {
      const img = await loadImageFromFile(selectedFile);
      setImgElement(img);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setCropBox({ x: 10, y: 10, w: 80, h: 80 });
    } catch (e) {
      console.error(e);
    }
  };

  // Adjust cropBox height when aspect ratio changes
  useEffect(() => {
    if (aspect === 'free') return;
    let targetRatio = 1;
    if (aspect === '1:1') targetRatio = 1;
    if (aspect === '16:9') targetRatio = 16 / 9;
    if (aspect === '4:3') targetRatio = 4 / 3;
    if (aspect === '9:16') targetRatio = 9 / 16;

    if (imgElement) {
      const imgRatio = imgElement.width / imgElement.height;
      const calcH = cropBox.w / (targetRatio / imgRatio);
      setCropBox((prev) => ({
        ...prev,
        h: Math.min(100 - prev.y, Math.max(10, calcH)),
      }));
    }
  }, [aspect, imgElement]);

  const handleDownload = async () => {
    if (!imgElement || !file) return;

    // First create transformed canvas (rotation & flip)
    const srcW = imgElement.width;
    const srcH = imgElement.height;

    const is90or270 = rotation === 90 || rotation === 270;
    const transW = is90or270 ? srcH : srcW;
    const transH = is90or270 ? srcW : srcH;

    const transCanvas = document.createElement('canvas');
    transCanvas.width = transW;
    transCanvas.height = transH;
    const ctx = transCanvas.getContext('2d');
    if (!ctx) return;

    ctx.translate(transW / 2, transH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(imgElement, -srcW / 2, -srcH / 2);

    // Now extract crop area
    const cropX = (cropBox.x / 100) * transW;
    const cropY = (cropBox.y / 100) * transH;
    const cropW = (cropBox.w / 100) * transW;
    const cropH = (cropBox.h / 100) * transH;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = cropW;
    finalCanvas.height = cropH;
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    finalCtx.drawImage(transCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const blob = await canvasToBlob(finalCanvas, 'image/png');
    downloadFile(blob, `${getCleanFileName(file.name)}_cropped.png`);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all hover:shadow-lg group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Photo to Crop & Rotate
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Supports Instagram 1:1, Story 9:16, YouTube 16:9 presets, rotate 90°, and flip.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Crop & Rotate</h3>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Change Image
              </button>
            </div>

            {/* Aspect Presets */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Aspect Ratio Presets
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['free', '1:1', '16:9', '4:3', '9:16'] as AspectRatio[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspect(r)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border capitalize transition-colors ${
                      aspect === r
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r === 'free' ? 'Freeform' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation & Flipping */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Transforms
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold gap-1"
                >
                  <RotateCw className="w-4 h-4 text-indigo-500" />
                  <span>Rotate 90°</span>
                </button>
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold gap-1 ${
                    flipH
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4 text-indigo-500" />
                  <span>Flip H</span>
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold gap-1 ${
                    flipV
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <FlipVertical className="w-4 h-4 text-indigo-500" />
                  <span>Flip V</span>
                </button>
              </div>
            </div>

            {/* Manual Sliders for Crop Area */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Crop Area Adjusters
              </span>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Crop Width</span>
                  <span>{cropBox.w}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropBox.w}
                  onChange={(e) => setCropBox((p) => ({ ...p, w: parseInt(e.target.value) }))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Crop Height</span>
                  <span>{cropBox.h}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropBox.h}
                  onChange={(e) => setCropBox((p) => ({ ...p, h: parseInt(e.target.value) }))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Cropped Image</span>
            </button>
          </div>

          {/* Interactive Workspace */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex-1 min-h-[380px] bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-hidden relative border border-slate-200/60 dark:border-slate-800">
              {imgElement && (
                <div className="relative inline-block max-h-[460px] max-w-full">
                  <img
                    src={imgElement.src}
                    alt="Transforming preview"
                    style={{
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                      maxHeight: '440px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                    className="rounded shadow-md transition-transform duration-200"
                  />

                  {/* Crop Overlay Box */}
                  <div
                    className="absolute border-2 border-indigo-500 bg-indigo-500/10 shadow-2xl rounded pointer-events-none"
                    style={{
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.w}%`,
                      height: `${cropBox.h}%`,
                    }}
                  >
                    <div className="absolute top-1 left-1 text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                      Crop Area
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
