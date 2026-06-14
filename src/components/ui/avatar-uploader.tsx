import React, { useState, useRef, useCallback } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { Camera, ZoomIn, ZoomOut, Upload } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Slider } from "./slider"
import { Modal } from "./modal"

interface AvatarUploaderProps {
  src?: string
  alt?: string
  onChange: (dataUrl: string) => void
  className?: string
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageSrc
  })

  const x = Math.round(pixelCrop.x)
  const y = Math.round(pixelCrop.y)
  const w = Math.round(pixelCrop.width)
  const h = Math.round(pixelCrop.height)

  if (w < 1 || h < 1) throw new Error("Invalid crop dimensions")

  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get canvas context")

  ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
  return canvas.toDataURL("image/jpeg", 0.95)
}

export function AvatarUploader({
  src,
  alt = "Avatar",
  onChange,
  className,
}: AvatarUploaderProps) {
  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFile(file)
    setImageSrc(dataUrl)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
  }, [])

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setIsCropping(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onChange(croppedImage)
      setOpen(false)
    } catch {
      // crop failed silently
    } finally {
      setIsCropping(false)
    }
  }, [imageSrc, croppedAreaPixels, onChange])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setImageSrc(null)
      setZoom(1)
    }
    setOpen(newOpen)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative size-20 overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100 cursor-pointer group",
          className
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="size-full flex items-center justify-center text-2xl font-black text-neutral-600 bg-gradient-to-br from-neutral-100 to-neutral-200">
            {alt.split(" ").slice(0, 2).map((w) => w[0]).join("")}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        title="Cambiar foto de perfil"
        description="Selecciona y recorta tu foto de perfil"
        className="sm:max-w-md"
      >
        <div className="space-y-4 p-4 pt-0">
          {!imageSrc ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="size-24 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-dashed border-neutral-300">
                <Upload className="h-8 w-8 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <Button
                variant="default"
                onClick={() => fileInputRef.current?.click()}
              >
                Seleccionar imagen
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-neutral-900">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-neutral-500 shrink-0" />
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={([v]: number[]) => setZoom(v)}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-neutral-500 shrink-0" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  Cambiar imagen
                </Button>
                <Button
                  variant="default"
                  onClick={handleCrop}
                  disabled={isCropping}
                  className="flex-1"
                >
                  {isCropping ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </Modal>
    </>
  )
}
