// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, organization, password, role } = await req.json();

    if (!name || !email || !organization || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    // Hash password (10 rounds is sufficient)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert role
    let validRole: string;
    if (role === "teacher" || role === "TEACHER") {
      validRole = "TEACHER";
    } else {
      validRole = "STUDENT";
    }

    // Create user - set isVerified to true (no email verification needed)
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        organization: organization,
        password: hashedPassword,
        role: validRole as any,
        isVerified: true, // ✅ KEY CHANGE: Set to true
      },
    });

    console.log("✅ User created:", newUser);

    return NextResponse.json(
      { message: "Signup successful! You can now log in.", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}