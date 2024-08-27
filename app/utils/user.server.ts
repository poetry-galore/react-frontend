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

export type  UpdateForm = {
  email: string;
  penName: string;
  bio: string;
  location: string;
  languages: string;
}

export type userUpdate = {
  email: string;
  penName: string;
  bio: string;
  location: string;
  languages: string;
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
      email: user.email,
      password: passwordHash,
    },
  });

  return { id: newUser.id, email: newUser.email };
}


export async function updateUser(userNew : UpdateForm): Promise<userUpdate> {
  
  const updatedUser = await prisma.user.update({
    where : {
      email: userNew.email
    }, 
    data : {
      penName: userNew.penName,
      location: userNew.location,
      bio: userNew.bio,
      languages: userNew.languages,
    }
  })

  return {
    email: updatedUser.email,
    penName: updatedUser.penName ? updatedUser.penName : 'pick a name',
    bio: updatedUser.bio ? updatedUser.bio : 'update your bio',
    location: updatedUser.location ? updatedUser.location : 'where do you live?',
    languages: updatedUser.languages ? updatedUser.languages : 'Add languages',
  }
}