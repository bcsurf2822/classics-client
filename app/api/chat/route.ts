import { NextResponse } from "next/server";

// Define types for the backend response
type BookMetadata = {
  title?: string;
  chapter?: string;
  page?: number;
};

type SearchResultItem = {
  text?: string;
  metadata?: BookMetadata;
};

type BackendSearchResponse = {
  results?: SearchResultItem[];
  response?: string;
  message?: string;
  indexes_searched?: string[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      query,
      indexName,
      limit = 5,
      personality = "classic_literature",
    } = body;

    console.log("Request to chat API:", {
      query,
      indexName,
      limit,
      personality,
    });

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const searchParams = new URLSearchParams();
    searchParams.append("query", query);
    if (indexName) searchParams.append("index_name", indexName);
    searchParams.append("limit", limit.toString());
    searchParams.append("personality", personality);

    const endpoint = `http://0.0.0.0:8000/search-books?${searchParams.toString()}`;
    console.log("Making request to backend:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API error:", response.status, errorText);
      throw new Error(
        `Error searching books: ${response.status} - ${errorText}`
      );
    }

    const data: BackendSearchResponse = await response.json();
    console.log("Backend API response:", JSON.stringify(data, null, 2));

    // Ensure the results structure is consistent
    const safeData = {
      results: Array.isArray(data.results)
        ? data.results.map((result: SearchResultItem) => ({
            text: result.text || "",
            metadata: {
              title: result.metadata?.title || "Unknown",
              chapter: result.metadata?.chapter,
              page: result.metadata?.page,
            },
          }))
        : [],
      response: data.response || data.message || "No response available",
      indexes_searched: Array.isArray(data.indexes_searched)
        ? data.indexes_searched
        : [],
      message: data.message,
    };

    console.log(
      "Normalized response to frontend:",
      JSON.stringify(safeData, null, 2)
    );
    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      {
        error: "Failed to search books",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const personality = searchParams.get("personality") || "classic_literature";

    const backendUrl = `http://0.0.0.0:8000/greeting?personality=${encodeURIComponent(
      personality
    )}`;
    console.log("Making request to backend /greeting:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Backend API error (greeting):",
        response.status,
        errorText
      );
      throw new Error(
        `Error getting greeting: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Backend /greeting response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat API GET route (greeting):", error);
    return NextResponse.json(
      {
        error: "Failed to get greeting",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
