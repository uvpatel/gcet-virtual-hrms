import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Attendance from "@/models/attendance.model";
import "@/models/user.model";

// Helper to get start and end of a specific date in UTC
function getDayRange(date: Date = new Date()) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
}

// GET /api/attendance/checkin - Check today's check-in status for a user
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const { start, end } = getDayRange();
    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: start, $lte: end },
    }).populate("user", "name email role employeeId");

    return NextResponse.json({
      success: true,
      hasCheckedIn: !!attendance?.checkIn,
      hasCheckedOut: !!attendance?.checkOut,
      data: attendance || null,
    });
  } catch (error: any) {
    console.error("GET /api/attendance/checkin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get checkin status" },
      { status: 500 }
    );
  }
}

// POST /api/attendance/checkin - Check-in for today
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { userId, time, checkIn } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const checkInTime = checkIn ? new Date(checkIn) : time ? new Date(time) : new Date();
    const { start } = getDayRange(checkInTime);

    // Find or create today's record
    let attendance = await Attendance.findOne({
      user: userId,
      date: start,
    });

    if (attendance && attendance.checkIn) {
      return NextResponse.json(
        {
          success: false,
          error: "Already checked in for today",
          data: attendance,
        },
        { status: 409 }
      );
    }

    if (attendance) {
      attendance.checkIn = checkInTime;
      attendance.status = "present";
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        user: userId,
        date: start,
        checkIn: checkInTime,
        status: "present",
      });
    }

    const populated = await Attendance.findById(attendance._id).populate(
      "user",
      "name email role employeeId"
    );

    return NextResponse.json({
      success: true,
      message: "Checked in successfully",
      data: populated,
    });
  } catch (error: any) {
    console.error("POST /api/attendance/checkin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check in" },
      { status: 500 }
    );
  }
}

// PUT /api/attendance/checkin - Overwrite today's attendance record
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { userId, checkIn, checkOut, status = "present" } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const { start } = getDayRange();
    const attendance = await Attendance.findOneAndUpdate(
      { user: userId, date: start },
      {
        user: userId,
        date: start,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status,
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    return NextResponse.json({
      success: true,
      message: "Checkin record updated successfully",
      data: attendance,
    });
  } catch (error: any) {
    console.error("PUT /api/attendance/checkin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update checkin" },
      { status: 500 }
    );
  }
}

// PATCH /api/attendance/checkin - Check-out for today
export async function PATCH(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { userId, time, checkOut } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const checkOutTime = checkOut ? new Date(checkOut) : time ? new Date(time) : new Date();
    const { start } = getDayRange(checkOutTime);

    const attendance = await Attendance.findOne({
      user: userId,
      date: start,
    });

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: "No check-in record found for today to check out from" },
        { status: 404 }
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        {
          success: false,
          error: "Already checked out for today",
          data: attendance,
        },
        { status: 409 }
      );
    }

    attendance.checkOut = checkOutTime;
    await attendance.save();

    const populated = await Attendance.findById(attendance._id).populate(
      "user",
      "name email role employeeId"
    );

    return NextResponse.json({
      success: true,
      message: "Checked out successfully",
      data: populated,
    });
  } catch (error: any) {
    console.error("PATCH /api/attendance/checkin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check out" },
      { status: 500 }
    );
  }
}

// DELETE /api/attendance/checkin - Reset / Remove today's check-in record
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const { start } = getDayRange();
    const deleted = await Attendance.findOneAndDelete({
      user: userId,
      date: start,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "No attendance record found for today" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Today's check-in record cleared successfully",
      data: deleted,
    });
  } catch (error: any) {
    console.error("DELETE /api/attendance/checkin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear check-in record" },
      { status: 500 }
    );
  }
}