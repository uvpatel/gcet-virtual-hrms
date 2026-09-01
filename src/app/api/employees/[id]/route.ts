import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import EmployeeProfile from "@/models/employee.model";
import mongoose from "mongoose";
import "@/models/user.model";

// Helper to query employee by either Profile ID or User ID
function getEmployeeFilter(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [{ _id: new mongoose.Types.ObjectId(id) }, { user: new mongoose.Types.ObjectId(id) }],
    };
  }
  return { _id: id };
}

// GET /api/employees/[id] - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const employee = await EmployeeProfile.findOne(getEmployeeFilter(id)).populate(
      "user",
      "name email role employeeId"
    );

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error: any) {
    console.error("GET /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// POST /api/employees/[id] - Add document or sub-resource to employee profile
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { documentName, documentUrl } = body;

    if (!documentName || !documentUrl) {
      return NextResponse.json(
        { success: false, error: "documentName and documentUrl are required" },
        { status: 400 }
      );
    }

    const employee = await EmployeeProfile.findOneAndUpdate(
      getEmployeeFilter(id),
      {
        $push: { documents: { name: documentName, url: documentUrl } },
      },
      { new: true }
    ).populate("user", "name email role employeeId");

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document added to employee profile",
      data: employee,
    });
  } catch (error: any) {
    console.error("POST /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add document" },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id] - Replace/update full employee profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { phone, address, profilePicture, jobTitle, department, dateOfJoining, documents } = body;

    const employee = await EmployeeProfile.findOneAndUpdate(
      getEmployeeFilter(id),
      {
        phone,
        address,
        profilePicture,
        jobTitle,
        department,
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
        documents: documents || [],
      },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee profile updated successfully",
      data: employee,
    });
  } catch (error: any) {
    console.error("PUT /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update employee profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/employees/[id] - Partially update employee profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    const employee = await EmployeeProfile.findOneAndUpdate(
      getEmployeeFilter(id),
      { $set: body },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee profile updated successfully",
      data: employee,
    });
  } catch (error: any) {
    console.error("PATCH /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch employee profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete employee profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const employee = await EmployeeProfile.findOneAndDelete(getEmployeeFilter(id));

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Employee profile deleted successfully",
      data: employee,
    });
  } catch (error: any) {
    console.error("DELETE /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete employee profile" },
      { status: 500 }
    );
  }
}