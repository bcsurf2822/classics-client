import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://0.0.0.0:8000/book-indexes");

    if (!response.ok) {
      throw new Error(`Error fetching book indexes: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in book indexes API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch book indexes" },
      { status: 500 }
    );
  }
}
