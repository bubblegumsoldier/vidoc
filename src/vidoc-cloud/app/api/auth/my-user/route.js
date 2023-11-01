import Auth0Authentication from "../../../utils/Auth0Authentication";
import UserRepository from "../../../data-access/UserRepository";
import { NextResponse } from "next/server";

export const GET = async function getMyUser(req, { params }) {
  const res = new NextResponse();
  const user = await Auth0Authentication.getCurrentUserFromRequest(req, res);
  if (!user) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      {
        status: 401,
      }
    );
  }
  return NextResponse.json(user, res);
};

export const PATCH = async function updateMyUser(req, { params }) {
  const res = new NextResponse();
  const user = await Auth0Authentication.getCurrentUserFromRequest(req, res);

  if (!user) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      {
        status: 401,
      }
    );
  }

  const { email, name } = await req.json();

  // Check if email is already in use
  const existingUser = await UserRepository.getUserByEmail(email);
  if (existingUser && existingUser.id !== user.id) {
    return NextResponse.json(
      { error: "Email is already in use." },
      {
        status: 400,
      }
    );
  }

  try {
    const updatedUser = await UserRepository.updateUser(user.id, {
      email,
      name,
    });
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user." },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(updatedUser, res);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating user." },
      {
        status: 500,
      }
    );
  }
};
