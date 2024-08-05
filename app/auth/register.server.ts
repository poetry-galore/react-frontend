import { json } from "@remix-run/node";

import { prisma } from "~/db/prisma.server";
import { createUser } from "~/utils/user.server";

export type RegisterForm = {
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
 * Creates a new user if none exists with the given data.
 *
 * @param user User data from the register form
 * @returns An error is returned if the registration fails, else nothing is returned.
 */
export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } });

  if (exists) {
    return json(
      { error: `User already exists with that email` },
      { status: 400 },
    );
  }

  const newUser = await createUser(user);

  if (!newUser) {
    return json(
      {
        error: "Something went wrong creating new user",
        fields: {
          email: user.email,
          password: user.password,
        },
      },
      { status: 500 },
    );
  }
}
