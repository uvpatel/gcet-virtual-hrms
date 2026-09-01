import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import EmployeeProfile from "@/models/employee.model";
import "@/models/user.model";

// GET /api/employees - Get all employees with optional query filters
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const jobTitle = searchParams.get("jobTitle");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (department) query.department = new RegExp(department, "i");
    if (jobTitle) query.jobTitle = new RegExp(jobTitle, "i");

    const employees = await EmployeeProfile.find(query)
      .populate("user", "name email role employeeId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EmployeeProfile.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create a new employee profile
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, phone, address, profilePicture, jobTitle, department, dateOfJoining, documents } = body;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const existingProfile = await EmployeeProfile.findOne({ user });
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: "Employee profile already exists for this user" },
        { status: 409 }
      );
    }

    const employee = await EmployeeProfile.create({
      user,
      phone,
      address,
      profilePicture,
      jobTitle,
      department,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
      documents: documents || [],
    });

    const populatedEmployee = await EmployeeProfile.findById(employee._id).populate(
      "user",
      "name email role employeeId"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Employee profile created successfully",
        data: populatedEmployee,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create employee profile" },
      { status: 500 }
    );
  }
}

// PUT /api/employees - Upsert or full batch update of employee profiles
export async function PUT(request: NextRequest) {
  try {
    await connectMongo();
    const body = await request.json();
    const { user, phone, address, profilePicture, jobTitle, department, dateOfJoining, documents } = body;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User ID is required for PUT operation" },
        { status: 400 }
      );
    }

    const employee = await EmployeeProfile.findOneAndUpdate(
      { user },
      {
        user,
        phone,
        address,
        profilePicture,
        jobTitle,
        department,
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
        documents: documents || [],
      },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    return NextResponse.json({
      success: true,
      message: "Employee profile saved successfully",
      data: employee,
    });
  } catch (error: any) {
    console.error("PUT /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update employee profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/employees - Bulk partial update
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

    const result = await EmployeeProfile.updateMany(filter, { $set: update });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} employee profiles`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error("PATCH /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch employees" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees - Bulk delete employees matching filter
export async function DELETE(request: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const userId = searchParams.get("userId");

    const query: Record<string, any> = {};
    if (department) query.department = department;
    if (userId) query.user = userId;

    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        { success: false, error: "Query parameter (userId or department) is required to prevent accidental full deletion" },
        { status: 400 }
      );
    }

    const result = await EmployeeProfile.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} employee profile(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete employees" },
      { status: 500 }
    );
  }
}