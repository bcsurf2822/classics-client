import { NextRequest, NextResponse } from "next/server";

// Backend API URL (replace with your actual backend URL)
const BACKEND_URL = "http://localhost:8000";

// Handler for uploading books
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/upload-book`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Upload failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading book:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
