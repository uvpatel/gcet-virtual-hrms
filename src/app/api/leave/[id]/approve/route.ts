import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Leave from "@/models/leave.model";
import "@/models/user.model";

// GET /api/leave/[id]/approve - Get approval details/status of leave request
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
        { success: false, error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: leave._id,
        status: leave.status,
        adminComment: leave.adminComment,
        reviewedBy: leave.reviewedBy,
        user: leave.user,
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
      },
    });
  } catch (error: any) {
    console.error("GET /api/leave/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch approval status" },
      { status: 500 }
    );
  }
}

// POST /api/leave/[id]/approve - Submit formal review decision (Approve or Reject)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { status, adminComment, reviewedBy } = body;

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Valid status ('approved', 'rejected', or 'pending') is required" },
        { status: 400 }
      );
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        adminComment: adminComment || "",
        reviewedBy: reviewedBy || undefined,
      },
      { new: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: leave,
    });
  } catch (error: any) {
    console.error("POST /api/leave/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to review leave request" },
      { status: 500 }
    );
  }
}

// PUT /api/leave/[id]/approve - Overwrite / reset full approval record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { status = "approved", adminComment = "", reviewedBy } = body;

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        adminComment,
        reviewedBy,
      },
      { new: true, runValidators: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave approval record overwritten successfully",
      data: leave,
    });
  } catch (error: any) {
    console.error("PUT /api/leave/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update leave approval" },
      { status: 500 }
    );
  }
}

// PATCH /api/leave/[id]/approve - Quick status update (Approve/Reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { status, adminComment, reviewedBy } = body;

    const update: Record<string, any> = {};
    if (status) update.status = status;
    if (adminComment !== undefined) update.adminComment = adminComment;
    if (reviewedBy !== undefined) update.reviewedBy = reviewedBy;

    const leave = await Leave.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Leave request updated to ${leave.status}`,
      data: leave,
    });
  } catch (error: any) {
    console.error("PATCH /api/leave/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch leave approval" },
      { status: 500 }
    );
  }
}

// DELETE /api/leave/[id]/approve - Reset approval decision back to pending
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        $set: { status: "pending", adminComment: "" },
        $unset: { reviewedBy: "" },
      },
      { new: true }
    )
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Leave approval decision revoked, reset to pending",
      data: leave,
    });
  } catch (error: any) {
    console.error("DELETE /api/leave/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset leave approval" },
      { status: 500 }
    );
  }
}