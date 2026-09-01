import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import Payroll from "@/models/payroll.model";
import "@/models/user.model";

// GET /api/payroll/[id] - Get individual payroll slip record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const payroll = await Payroll.findById(id).populate(
      "user",
      "name email role employeeId"
    );

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payroll,
    });
  } catch (error: any) {
    console.error("GET /api/payroll/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payroll record" },
      { status: 500 }
    );
  }
}

// POST /api/payroll/[id] - Attach slip URL / trigger pay slip calculation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { slipUrl } = body;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { $set: { slipUrl } },
      { new: true }
    ).populate("user", "name email role employeeId");

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payroll slip attached successfully",
      data: payroll,
    });
  } catch (error: any) {
    console.error("POST /api/payroll/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to attach slip" },
      { status: 500 }
    );
  }
}

// PUT /api/payroll/[id] - Full update of payroll record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const { baseSalary, allowances, deductions, month, slipUrl } = body;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      {
        baseSalary: Number(baseSalary),
        allowances: Number(allowances || 0),
        deductions: Number(deductions || 0),
        month,
        slipUrl,
      },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payroll record replaced successfully",
      data: payroll,
    });
  } catch (error: any) {
    console.error("PUT /api/payroll/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update payroll record" },
      { status: 500 }
    );
  }
}

// PATCH /api/payroll/[id] - Partial update of payroll fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, any> = {};
    if (body.baseSalary !== undefined) update.baseSalary = Number(body.baseSalary);
    if (body.allowances !== undefined) update.allowances = Number(body.allowances);
    if (body.deductions !== undefined) update.deductions = Number(body.deductions);
    if (body.month !== undefined) update.month = body.month;
    if (body.slipUrl !== undefined) update.slipUrl = body.slipUrl;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate("user", "name email role employeeId");

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payroll record updated successfully",
      data: payroll,
    });
  } catch (error: any) {
    console.error("PATCH /api/payroll/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to patch payroll record" },
      { status: 500 }
    );
  }
}

// DELETE /api/payroll/[id] - Delete payroll record by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    const payroll = await Payroll.findByIdAndDelete(id);

    if (!payroll) {
      return NextResponse.json(
        { success: false, error: "Payroll record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payroll record deleted successfully",
      data: payroll,
    });
  } catch (error: any) {
    console.error("DELETE /api/payroll/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete payroll record" },
      { status: 500 }
    );
  }
}
