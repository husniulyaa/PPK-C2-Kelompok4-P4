import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: {
      userId: number;
      type?: string;
      category?: string;
      title?: { contains: string; mode?: "insensitive" };
    } = {
      userId: session.id,
    };

    if (type && (type === "income" || type === "expense")) {
      where.type = type;
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (search && search.trim() !== "") {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const allUserTransactions = await prisma.transaction.findMany({
      where: { userId: session.id },
      select: { amount: true, type: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of allUserTransactions) {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else if (tx.type === "expense") {
        totalExpense += tx.amount;
      }
    }

    const totalBalance = totalIncome - totalExpense;

    return NextResponse.json({
      transactions,
      stats: {
        totalBalance,
        totalIncome,
        totalExpense,
        transactionCount: allUserTransactions.length,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { title, amount, type, category, date } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Transaction title is required" },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number greater than 0" },
        { status: 400 }
      );
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be either 'income' or 'expense'" },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const transactionDate = date ? new Date(date) : new Date();

    const newTransaction = await prisma.transaction.create({
      data: {
        title: title.trim(),
        amount: parsedAmount,
        type,
        category: category.trim(),
        date: transactionDate,
        userId: session.id, 
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
