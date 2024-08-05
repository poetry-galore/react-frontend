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


type UpdateForm = {
  id: string;
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  bio: string;
  DOB: Date;
  location: string;
  gender: string;
  penName: string;
  languages: string[];
  favouriteQuotes: string[];
};

type UpdatedUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  bio: string;
  DOB: Date;
  location: string;
  gender: string;
  penName: string;
  languages: string[];
  favouriteQuotes: string[];
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
      username: 'your unique username',
      profilePicture: "",
      bio: "A short description of yourself",
      DOB: new Date(),
      location: "Your present country and nearest city",
      gender: "male, female or non-conforming",
      penName: "A unique one!",
      languages: ["English", "Kiswahili", "Spanish"],
      favouriteQuotes: ["Just the first one is enough",],
    },
  });

  return newUser;
}

/**
 * Updates the user information in the database
 *
 * @param user User data
 * @returns Object of the new updated user.
 */
export async function updateUser(user: UpdateForm): Promise<UpdatedUser> {
  const userId = await prisma.user
    .findUnique({
      where: {
        email: user.email,
      },
    })
    .then((uSer) => uSer?.id);
  // consider using prisma.user.upsert for the documents that do not exist ???

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: user,
  });

  
  return updatedUser;
}
