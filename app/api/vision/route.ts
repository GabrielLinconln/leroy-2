import { NextResponse } from "next/server";
import { analyzeVisionInput } from "@/lib/visionEngine";
import { DEFAULT_STORE_ID } from "@/lib/stores";
import { VisionSampleId } from "@/lib/types";

type VisionRequestBody = {
  sampleId?: VisionSampleId;
  fileName?: string;
  caption?: string;
  imagePreview?: string;
  storeId?: string;
};

export async function POST(req: Request) {
  let body: VisionRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const analysis = analyzeVisionInput({
    sampleId: body.sampleId,
    fileName: body.fileName,
    caption: body.caption,
    imagePreview: body.imagePreview,
    storeId: body.storeId || DEFAULT_STORE_ID,
  });

  // Latência simulada da pipeline visual
  await new Promise((r) => setTimeout(r, 550));

  return NextResponse.json({
    analysis,
    engine: "lm-vision-local-v2",
  });
}
