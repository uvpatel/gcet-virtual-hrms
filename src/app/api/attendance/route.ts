import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Attendance from "@/models/attendance.model";
import "@/models/user.model";

// GET /api/attendance - Fetch attendance records with filtering
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const dateStr = searchParams.get("date");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (userId) query.user = userId;
    if (status) query.status = status;

    if (dateStr) {
      const startOfDay = new Date(dateStr);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDateStr && endDateStr) {
      query.date = {
        $gte: new Date(startDateStr),
        $lte: new Date(endDateStr),
      };
    }

    const records = await Attendance.find(query)
      .populate("user", "name email role employeeId")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/attendance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Create a new attendance record
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, date, checkIn, checkOut, status = "present" } = body;

    if (!user || !date) {
      return NextResponse.json(
        { success: false, error: "user and date are required" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const record = await Attendance.create({
      user,
      date: attendanceDate,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      status,
    });

    const populatedRecord = await Attendance.findById(record._id).populate(
      "user",
      "name email role employeeId"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Attendance recorded successfully",
        data: populatedRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/attendance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create attendance record" },
      { status: 500 }
    );
  }
}

// PUT /api/attendance - Upsert attendance record for a user and date
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, date, checkIn, checkOut, status } = body;

    if (!user || !date) {
      return NextResponse.json(
        { success: false, error: "user and date are required" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      { user, date: attendanceDate },
      {
        user,
        date: attendanceDate,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status: status || "present",
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    return NextResponse.json({
      success: true,
      message: "Attendance upserted successfully",
      data: record,
    });
  } catch (error: any) {
    console.error("PUT /api/attendance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update attendance record" },
      { status: 500 }
    );
  }
}

// PATCH /api/attendance - Bulk update attendance status or timestamps
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

    const result = await Attendance.updateMany(filter, { $set: update });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} attendance records`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("PATCH /api/attendance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch attendance records" },
      { status: 500 }
    );
  }
}

// DELETE /api/attendance - Delete attendance records by query criteria
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");
    const dateStr = searchParams.get("date");

    const query: Record<string, any> = {};
    if (id) query._id = id;
    if (userId) query.user = userId;
    if (dateStr) {
      const targetDate = new Date(dateStr);
      targetDate.setUTCHours(0, 0, 0, 0);
      query.date = targetDate;
    }

    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one query parameter (id, userId, date) is required for deletion" },
        { status: 400 }
      );
    }

    const result = await Attendance.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} attendance record(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/attendance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete attendance records" },
      { status: 500 }
    );
  }
}