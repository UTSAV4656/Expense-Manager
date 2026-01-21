import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isAdmin } from "@/lib/admin"

// GET all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.users.findMany({
      select: {
        UserID: true,
        UserName: true,
        EmailAddress: true,
        MobileNo: true,
        ProfileImage: true,
        Created: true,
        Modified: true,
      },
      orderBy: {
        Created: "desc",
      },
    })

    // Transform to match frontend expectations
    const transformedUsers = users.map((user) => ({
      id: user.UserID.toString(),
      email: user.EmailAddress,
      full_name: user.UserName,
      mobile_no: user.MobileNo,
      profile_image: user.ProfileImage,
      created_at: user.Created.toISOString(),
      updated_at: user.Modified.toISOString(),
      // Determine admin status based on email or UserID
      role: isAdmin(user.EmailAddress, user.UserID) ? ("admin" as const) : ("user" as const),
    }))

    return NextResponse.json({ users: transformedUsers }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, password, mobile_no } = body

    if (!email || !full_name) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: { EmailAddress: email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create new user
    // Note: In production, you should hash the password before storing
    const newUser = await prisma.users.create({
      data: {
        UserName: full_name,
        EmailAddress: email,
        Password: password || "defaultPassword123", // In production, hash this
        MobileNo: mobile_no || "",
        Created: new Date(),
        Modified: new Date(),
      },
      select: {
        UserID: true,
        UserName: true,
        EmailAddress: true,
        MobileNo: true,
        ProfileImage: true,
        Created: true,
        Modified: true,
      },
    })

    // Transform to match frontend expectations
    const transformedUser = {
      id: newUser.UserID.toString(),
      email: newUser.EmailAddress,
      full_name: newUser.UserName,
      mobile_no: newUser.MobileNo,
      profile_image: newUser.ProfileImage,
      created_at: newUser.Created.toISOString(),
      updated_at: newUser.Modified.toISOString(),
      role: isAdmin(newUser.EmailAddress, newUser.UserID) ? ("admin" as const) : ("user" as const),
    }

    return NextResponse.json({ user: transformedUser }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

// PUT update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, full_name, mobile_no } = body

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const userId = parseInt(id, 10)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid User ID" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { UserID: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.EmailAddress) {
      const emailExists = await prisma.users.findFirst({
        where: { EmailAddress: email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { UserID: userId },
      data: {
        ...(email && { EmailAddress: email }),
        ...(full_name && { UserName: full_name }),
        ...(mobile_no !== undefined && { MobileNo: mobile_no }),
        Modified: new Date(),
      },
      select: {
        UserID: true,
        UserName: true,
        EmailAddress: true,
        MobileNo: true,
        ProfileImage: true,
        Created: true,
        Modified: true,
      },
    })

    // Transform to match frontend expectations
    const transformedUser = {
      id: updatedUser.UserID.toString(),
      email: updatedUser.EmailAddress,
      full_name: updatedUser.UserName,
      mobile_no: updatedUser.MobileNo,
      profile_image: updatedUser.ProfileImage,
      created_at: updatedUser.Created.toISOString(),
      updated_at: updatedUser.Modified.toISOString(),
      role: isAdmin(updatedUser.EmailAddress, updatedUser.UserID) ? ("admin" as const) : ("user" as const),
    }

    return NextResponse.json({ user: transformedUser }, { status: 200 })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const userId = parseInt(id, 10)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid User ID" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { UserID: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Delete user
    await prisma.users.delete({
      where: { UserID: userId },
    })

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
