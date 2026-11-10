import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminBannerService } from "@/lib/admin-firestore-services";
import { getCachedBannerById, invalidatePublicDataCache } from "@/lib/public-data-cache";

// GET /api/banners/[id] - Get single banner
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await getCachedBannerById(params.id);
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id] - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  try {
    const body = await request.json();
    await adminBannerService.update(params.id, body);
    invalidatePublicDataCache("banners");
    revalidatePath("/");
    return NextResponse.json({ message: "Banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id] - Delete banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionCookie = request.cookies.get("authToken")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  try {
    await adminBannerService.delete(params.id);
    invalidatePublicDataCache("banners");
    revalidatePath("/");
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
