import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Leave from "@/models/leave.model";
import "@/models/user.model";

// GET /api/leave - Fetch leave requests with filters
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (userId) query.user = userId;
    if (status) query.status = status;
    if (type) query.type = type;

    const leaves = await Leave.find(query)
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: leaves,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

// POST /api/leave - Submit a new leave request
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, type, startDate, endDate, remarks } = body;

    if (!user || !type || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "user, type, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const leave = await Leave.create({
      user,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remarks,
      status: "pending",
    });

    const populatedLeave = await Leave.findById(leave._id)
      .populate("user", "name email role employeeId")
      .populate("reviewedBy", "name email role");

    return NextResponse.json(
      {
        success: true,
        message: "Leave application submitted successfully",
        data: populatedLeave,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit leave application" },
      { status: 500 }
    );
  }
}

// PUT /api/leave - Replace/resubmit leave application
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { id, user, type, startDate, endDate, remarks, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Leave ID (id) is required for PUT update" },
        { status: 400 }
      );
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        user,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        remarks,
        status: status || "pending",
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
      message: "Leave request updated successfully",
      data: leave,
    });
  } catch (error: any) {
    console.error("PUT /api/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update leave request" },
      { status: 500 }
    );
  }
}

// PATCH /api/leave - Bulk update leave requests
export async function PATCH(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { filter = {}, update } = body;

    if (!update) {
      return NextResponse.json(
        { success: false, error: "Update payload is required" },
        { status: 400 }
      );
    }

    const result = await Leave.updateMany(filter, { $set: update });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} leave request(s)`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("PATCH /api/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch leave requests" },
      { status: 500 }
    );
  }
}

// DELETE /api/leave - Bulk delete leave requests by criteria
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    const query: Record<string, any> = {};
    if (id) query._id = id;
    if (userId) query.user = userId;
    if (status) query.status = status;

    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        { success: false, error: "Query parameter (id, userId, or status) is required" },
        { status: 400 }
      );
    }

    const result = await Leave.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} leave request(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete leave requests" },
      { status: 500 }
    );
  }
}