import { NextResponse } from 'next/server';
import { discoverKiroDocuments } from '@/lib/blueprint/file-discovery';

export async function GET() {
  try {
    const result = discoverKiroDocuments();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { exists: false, documents: [], error: (error as Error).message },
      { status: 500 }
    );
  }
}
