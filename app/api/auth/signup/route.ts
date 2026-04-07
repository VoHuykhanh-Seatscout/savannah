// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";
import { UserRole } from "@prisma/client";

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Convert role to match UserRole enum
    let validRole: UserRole;
    if (role === "teacher" || role === "TEACHER") {
      validRole = UserRole.TEACHER;
    } else {
      validRole = UserRole.STUDENT;
    }

    let newUser;
    try {
      // Create user with organization
      newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          organization: organization, // Add organization field
          password: hashedPassword,
          role: validRole,
          isVerified: false,
        },
      });

      // Create verification token
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: verificationToken,
          expires: expiresAt,
        },
      });
    } catch (dbError) {
      console.error("❌ Database Error:", dbError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    console.log("✅ User created:", newUser);

    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, verificationToken);
    } catch (emailError) {
      console.error("❌ Email send failed:", emailError);
      
      // Clean up - delete user if email fails
      try {
        await prisma.user.delete({ where: { id: newUser.id } });
        await prisma.verificationToken.delete({
          where: { token: verificationToken }
        });
      } catch (deleteError) {
        console.error("❌ Cleanup failed:", deleteError);
      }

      return NextResponse.json(
        { error: "Signup failed: Could not send verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Signup successful! Check your email for verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}