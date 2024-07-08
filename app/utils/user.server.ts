/**
 * User specific functions
 */

import bcrypt from "bcryptjs";

import { RegisterForm } from "~/auth/register.server";
import { prisma } from "~/db/prisma.server";

type UserOut = {
  id: string;
  email: string;
};

/**
 * Creates a new user and adds them to the database.
 *
 * @param user User Data
 * @returns Object of the user's id and email
 */
export async function createUser(user: RegisterForm): Promise<UserOut> {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
    },
  });

  return { id: newUser.id, email: newUser.email };
}
