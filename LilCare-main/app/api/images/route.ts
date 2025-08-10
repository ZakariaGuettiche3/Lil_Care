import { saveFile } from "@/server/azure";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: Response) {
  // Second step is get File from request

  const params = await req.formData();

  const file = params.get("file") as File;

  try {
    //  Third step is to upload file into azure blob storage
    const upload = await saveFile(file);
    const fileUrl = `${upload}?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D`;
   

    return NextResponse.json<{url: string, type: string}>(upload);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to download file" },
      { status: 500 }
    );
  }
}
