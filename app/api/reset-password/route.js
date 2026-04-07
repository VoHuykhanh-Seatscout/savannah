// app/api/reset-password/route.js
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const generateToken = () => randomBytes(32).toString("hex");

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      // For security, still return success even if user not found
      return NextResponse.json({ 
        message: "If your email exists, a reset link was sent." 
      });
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ 
      message: "If your email exists, a reset link was sent." 
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}