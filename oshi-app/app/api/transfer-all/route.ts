import { NextResponse } from "next/server";
import { executeDevilTransfer } from "@/lib/oshi-transfer";

export async function POST() {
  try {
    const result = await executeDevilTransfer({
      oshiAccountId: process.env.SUNABAR_OSHIKATSU_ACCOUNT_ID!,
      parentAccountId: process.env.SUNABAR_PARENT_ACCOUNT!,
    });
    console.log("oshi:", process.env.SUNABAR_OSHIKATSU_ACCOUNT_ID);
    console.log("parent:", process.env.SUNABAR_PARENT_ACCOUNT);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("献上失敗:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
