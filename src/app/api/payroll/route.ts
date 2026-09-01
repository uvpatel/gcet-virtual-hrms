import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Payroll from "@/models/payroll.model";
import "@/models/user.model";

// GET /api/payroll - Get payroll records with filters (month, userId)
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (userId) query.user = userId;
    if (month) query.month = month;

    const records = await Payroll.find(query)
      .populate("user", "name email role employeeId")
      .skip(skip)
      .limit(limit)
      .sort({ month: -1, createdAt: -1 });

    const total = await Payroll.countDocuments(query);

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
    console.error("GET /api/payroll error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payroll records" },
      { status: 500 }
    );
  }
}

// POST /api/payroll - Generate/create a payroll record
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, baseSalary, allowances = 0, deductions = 0, month, slipUrl } = body;

    if (!user || baseSalary === undefined || !month) {
      return NextResponse.json(
        { success: false, error: "user, baseSalary, and month (YYYY-MM) are required" },
        { status: 400 }
      );
    }

    const payroll = await Payroll.create({
      user,
      baseSalary: Number(baseSalary),
      allowances: Number(allowances),
      deductions: Number(deductions),
      month,
      slipUrl,
    });

    const populated = await Payroll.findById(payroll._id).populate(
      "user",
      "name email role employeeId"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payroll record created successfully",
        data: populated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/payroll error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payroll record" },
      { status: 500 }
    );
  }
}

// PUT /api/payroll - Upsert payroll record for a user and month
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, baseSalary, allowances = 0, deductions = 0, month, slipUrl } = body;

    if (!user || !month) {
      return NextResponse.json(
        { success: false, error: "user and month are required" },
        { status: 400 }
      );
    }

    const payroll = await Payroll.findOneAndUpdate(
      { user, month },
      {
        user,
        baseSalary: Number(baseSalary),
        allowances: Number(allowances),
        deductions: Number(deductions),
        month,
        slipUrl,
      },
      { upsert: true, new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    return NextResponse.json({
      success: true,
      message: "Payroll record updated successfully",
      data: payroll,
    });
  } catch (error: any) {
    console.error("PUT /api/payroll error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update payroll record" },
      { status: 500 }
    );
  }
}

// PATCH /api/payroll - Bulk update payroll records (e.g. adjust deductions or bonus)
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

    const result = await Payroll.updateMany(filter, { $set: update });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} payroll record(s)`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("PATCH /api/payroll error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch payroll records" },
      { status: 500 }
    );
  }
}

// DELETE /api/payroll - Delete payroll records by query criteria
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const id = searchParams.get("id");

    const query: Record<string, any> = {};
    if (id) query._id = id;
    if (userId) query.user = userId;
    if (month) query.month = month;

    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one query parameter (id, userId, or month) is required" },
        { status: 400 }
      );
    }

    const result = await Payroll.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} payroll record(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/payroll error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete payroll records" },
      { status: 500 }
    );
  }
}