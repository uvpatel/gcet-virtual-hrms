import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Leave from "@/models/leave.model";
import "@/models/user.model";

// GET /api/leave/[id] - Get specific leave application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const leave = await Leave.findById(id)
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leave,
    });
  } catch (error: any) {
    console.error("GET /api/leave/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leave application" },
      { status: 500 }
    );
  }
}

// POST /api/leave/[id] - Add note/comment or appeal to leave request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { remarks, adminComment } = body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(remarks && { remarks }),
          ...(adminComment && { adminComment }),
        },
      },
      { new: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave application updated with note",
      data: leave,
    });
  } catch (error: any) {
    console.error("POST /api/leave/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update leave application" },
      { status: 500 }
    );
  }
}

// PUT /api/leave/[id] - Full update of leave request
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { type, startDate, endDate, remarks, status, adminComment } = body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        remarks,
        status: status || "pending",
        adminComment,
      },
      { new: true, runValidators: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave application replaced successfully",
      data: leave,
    });
  } catch (error: any) {
    console.error("PUT /api/leave/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update leave application" },
      { status: 500 }
    );
  }
}

// PATCH /api/leave/[id] - Partial update of leave request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, any> = {};
    if (body.type !== undefined) update.type = body.type;
    if (body.startDate !== undefined) update.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) update.endDate = new Date(body.endDate);
    if (body.remarks !== undefined) update.remarks = body.remarks;
    if (body.status !== undefined) update.status = body.status;
    if (body.adminComment !== undefined) update.adminComment = body.adminComment;
    if (body.reviewedBy !== undefined) update.reviewedBy = body.reviewedBy;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave application updated successfully",
      data: leave,
    });
  } catch (error: any) {
    console.error("PATCH /api/leave/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch leave application" },
      { status: 500 }
    );
  }
}

// DELETE /api/leave/[id] - Delete/cancel leave application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const leave = await Leave.findByIdAndDelete(id);

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave application deleted successfully",
      data: leave,
    });
  } catch (error: any) {
    console.error("DELETE /api/leave/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete leave application" },
      { status: 500 }
    );
  }
}
