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


type UpdatedUser = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    password: string;
}
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
      username: user.username,
      email: user.email,
      password: passwordHash,
    },
  });

  return  newUser ;
}

/**
 * Updates the user information in the database
 * 
 * @param user User data
 * @returns Object of the new updated user.
 */ 
export async function updateUser(user: RegisterForm): Promise<UpdatedUser> {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const userId = await prisma.user.findUnique({
    where: {
      email: user.email,
    }
  }).then(
    (uSer) =>  uSer?.id
  );

  const updatedUser = await prisma.user.update({
    where: {id: userId},
    data: {
      email: user.email,
      password: passwordHash,
    },
  });

  return  updatedUser 
}