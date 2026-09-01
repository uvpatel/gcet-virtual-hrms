import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Attendance from "@/models/attendance.model";
import "@/models/user.model";

// GET /api/attendance/[id] - Get attendance by record ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const record = await Attendance.findById(id).populate(
      "user",
      "name email role employeeId"
    );

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error("GET /api/attendance/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch attendance record" },
      { status: 500 }
    );
  }
}

// POST /api/attendance/[id] - Add note/remark to attendance record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { note, status } = body;

    const record = await Attendance.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(status && { status }),
          ...(note && { note }),
        },
      },
      { new: true }
    ).populate("user", "name email role employeeId");

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Attendance record updated",
      data: record,
    });
  } catch (error: any) {
    console.error("POST /api/attendance/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update attendance record" },
      { status: 500 }
    );
  }
}

// PUT /api/attendance/[id] - Replace attendance record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { date, checkIn, checkOut, status } = body;

    const record = await Attendance.findByIdAndUpdate(
      id,
      {
        ...(date && { date: new Date(date) }),
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status: status || "present",
      },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Attendance record replaced successfully",
      data: record,
    });
  } catch (error: any) {
    console.error("PUT /api/attendance/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update attendance record" },
      { status: 500 }
    );
  }
}

// PATCH /api/attendance/[id] - Partially update attendance record
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, any> = {};
    if (body.checkIn !== undefined) update.checkIn = body.checkIn ? new Date(body.checkIn) : null;
    if (body.checkOut !== undefined) update.checkOut = body.checkOut ? new Date(body.checkOut) : null;
    if (body.status !== undefined) update.status = body.status;
    if (body.date !== undefined) update.date = new Date(body.date);

    const record = await Attendance.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Attendance record updated successfully",
      data: record,
    });
  } catch (error: any) {
    console.error("PATCH /api/attendance/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch attendance record" },
      { status: 500 }
    );
  }
}

// DELETE /api/attendance/[id] - Delete attendance record by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const record = await Attendance.findByIdAndDelete(id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Attendance record deleted successfully",
      data: record,
    });
  } catch (error: any) {
    console.error("DELETE /api/attendance/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete attendance record" },
      { status: 500 }
    );
  }
}
