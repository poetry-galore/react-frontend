/**
 * User specific functions
 */

import bcrypt from "bcryptjs";

import { prisma } from "~/db/prisma.server";
import { RegisterForm } from "~/routes/_auth.register/register.server";

type UserOut = {
  id: string;
  email: string;
};

export type UpdateForm = {
  profilePicture: string;
  penName: string;
  bio: string;
};

export type userUpdate = {
  email: string;
  profilePicture: string | null;
  penName: string | null;
  bio: string | null;
};

/**
 * Creates a new user and adds them to the database.
 *
 * @param user User Data
 * @returns Object of the user's id and email
 */
export async function createUser(user: RegisterForm): Promise<UserOut | null> {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
    },
  });

  return { id: newUser.id, email: newUser.email };
}

export async function updateUser(
  userNew: UpdateForm,
  userId: string,
): Promise<userUpdate> {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profileP: userNew.profilePicture,
      penName: userNew.penName,
      bio: userNew.bio,
    },
  });

  return {
    email: updatedUser.email,
    profilePicture: updatedUser.profileP,
    penName: updatedUser.penName ? updatedUser.penName : "pick a name",
    bio: updatedUser.bio ? updatedUser.bio : "update your bio",
  };
}

export async function getUserDetails(
  userId: string | null,
): Promise<userUpdate | null> {
  if (userId) {
    const userDetails = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    return {
      email: userDetails.email,
      profilePicture: userDetails.profileP,
      penName: userDetails.penName,
      bio: userDetails.bio,
    };
  }

  return null;
}
