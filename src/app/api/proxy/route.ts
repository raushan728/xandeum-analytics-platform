import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUrl, ...rpcPayload } = body;

    const finalUrl = targetUrl || "http://34.127.11.12:6000/rpc";

    console.log(`Proxying request to: ${finalUrl}`);

    const response = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rpcPayload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to the provided RPC Endpoint." },
      { status: 500 }
    );
  }
}
