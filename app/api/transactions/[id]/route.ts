import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/transactions/[id]
// Updates a transaction only if it belongs to the authenticated user
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const transactionId = parseInt(id, 10);

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    // Check transaction existence
    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // STRICT AUTHORIZATION: User A cannot edit User B's transaction
    if (existing.userId !== session.id) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to update this transaction" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, amount, type, category, date } = body;

    // Validate updates
    if (title && (typeof title !== "string" || title.trim().length === 0)) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number greater than 0" },
          { status: 400 }
        );
      }
    }

    if (type && type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be either 'income' or 'expense'" },
        { status: 400 }
      );
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(amount !== undefined ? { amount: parseFloat(amount) } : {}),
        ...(type ? { type } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(date ? { date: new Date(date) } : {}),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id]
// Deletes a transaction only if it belongs to the authenticated user
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const transactionId = parseInt(id, 10);

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    // Check transaction existence
    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // STRICT AUTHORIZATION: User A cannot delete User B's transaction
    if (existing.userId !== session.id) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to delete this transaction" },
        { status: 403 }
      );
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { success: true, message: "Transaction deleted successfully", id: transactionId },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
