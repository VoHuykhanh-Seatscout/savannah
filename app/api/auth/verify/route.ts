// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "❌ Token is required." }, { status: 400 });
    }

    // Clean the token if it's part of a URL query string
    let cleanedToken = token;
    try {
      if (token.startsWith("http")) {
        const url = new URL(token);
        cleanedToken = url.searchParams.get("token") || "";
      }
    } catch (err) {
      // Ignore if token is already cleaned and valid
    }

    cleanedToken = decodeURIComponent(cleanedToken); // Decode to prevent double encoding
    console.log("🔍 Verifying cleaned token:", cleanedToken);

    if (!cleanedToken) {
      return NextResponse.json({ error: "❌ Invalid token format." }, { status: 400 });
    }

    // Check if the token exists in the database
    const storedToken = await prisma.verificationToken.findUnique({
      where: { token: cleanedToken },
    });

    if (!storedToken) {
      console.error("❌ Token not found.");
      return NextResponse.json({ error: "❌ Invalid or expired token." }, { status: 400 });
    }

    // Ensure token expiration is checked against the current time
    const now = new Date();
    if (new Date(storedToken.expires) < now) {
      console.error("❌ Token has expired.");
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token: cleanedToken },
      });
      return NextResponse.json({ error: "❌ Token has expired." }, { status: 400 });
    }

    // Find the user associated with the token using 'identifier' field (which stores email)
    const user = await prisma.user.findUnique({
      where: { email: storedToken.identifier }, // Changed from storedToken.email to storedToken.identifier
    });

    if (!user) {
      console.error(`❌ No user found for email: ${storedToken.identifier}`);
      return NextResponse.json({ error: "❌ No user found." }, { status: 400 });
    }

    // Handle case where the user is already verified
    if (user.isVerified) {
      console.warn(`⚠️ User ${user.email} is already verified.`);
      // Delete the token if it exists
      await prisma.verificationToken.delete({
        where: { token: cleanedToken },
      }).catch(() => console.log("⚠️ Token already deleted"));
      
      return NextResponse.json({
        success: true,
        message: "User already verified.",
        isVerified: true,
        email: user.email,
        role: user.role,
        redirect: user.role === "TEACHER" ? "/teacher-dashboard" : "/dashboard",
      });
    }

    // Mark the user as verified
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { isVerified: true },
    });

    console.log(`✅ User ${user.email} verified successfully!`);

    // Delete the token after verification
    await prisma.verificationToken.delete({
      where: { token: cleanedToken },
    }).catch(() => console.log("⚠️ Token already deleted"));
    console.log("✅ Token deleted after successful verification.");

    // Return success response with user email and redirect URL
    return NextResponse.json({
      success: true,
      isVerified: true,
      email: updatedUser.email,
      role: updatedUser.role,
      redirect: updatedUser.role === "TEACHER" ? "/teacher-dashboard" : "/dashboard",
    });

  } catch (error) {
    console.error("❌ Error verifying email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}