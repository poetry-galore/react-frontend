/**
 * Poem specific functions
 */

import { Poem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "~/db/prisma.server";
import { User } from "~/auth/authenticator.server";

/**
 * Type of the expected poem data when creating a poem.
 */
export type PoemCreateType = {
  content: string;
  title: string;
  description?: string;
  authorId: string;
};

export type PoemUpdateType = {
  content: string;
  title: string;
  description?: string;
};

/**
 * Type of the return value of the createPoem function
 */
type PoemOut = {
  id: string;
};

/**
 * Creates a new poem and adds them to the database.
 *
 * @param poemCreate Poem Data
 * @returns Object with the id of the new poem
 */
export async function createPoem(poemCreate: PoemCreateType): Promise<PoemOut> {
  const newPoem = await prisma.poem.create({
    data: {
      title: poemCreate.title,
      description: poemCreate.description,
      content: poemCreate.content,
      author: {
        connect: {
          id: poemCreate.authorId,
        },
      },
    },
  });

  return { id: newPoem.id };
}

/**
 * Gets a poem with the given id
 *
 * @param poemId Id of the poem to get
 * @returns Poem with the given id, else null
 */
export async function getPoemWithId(poemId: string): Promise<Poem | null> {
  return await prisma.poem.findUnique({ where: { id: poemId } });
}

/**
 * Updates a poem with the given id with the poemUpdate data.
 *
 * @param poemId Id of the poem to update
 * @param poemUpdate Poem Data to use for update
 * @returns Updated poem.
 */
export async function updatePoem(poemId: string, poemUpdate: PoemUpdateType) {
  return await prisma.poem.update({ where: { id: poemId }, data: poemUpdate });
}

/**
 * Deletes a poem with the given id.
 *
 * @param poemId Id of the poem to delete
 * @returns The deleted poem
 */
export async function deletePoem(poemId: string) {
  return await prisma.poem.delete({ where: { id: poemId } });
}

/**
 * Gets a poem with the given id and if the poem is not found,
 * a Response with status 404 is thrown.
 *
 * If any other error occurs, a Response with status 500 is thrown.
 *
 * @param poemId Id of the poem to get
 * @returns The poem with the given ID
 */
export async function getPoemWithIdOrThrow(poemId: string) {
  let poem: Poem | null;

  try {
    poem = await getPoemWithId(poemId);

    if (!poem) {
      throw new Response(null, { status: 404, statusText: "Poem not found" });
    }
  } catch (error: any) {
    console.log(error);

    if (error instanceof PrismaClientKnownRequestError) {
      throw new Response(null, { status: 404, statusText: "Poem not found" });
    } else if (error instanceof Response) {
      throw error;
    } else {
      throw new Response(null, { status: 500, statusText: "Server error" });
    }
  }

  return poem;
}

/**
 * Gets a poem with the given Id that was authored by the given user. If the user
 * is not author, a Response with status 403 is thrown.
 *
 * Uses {@link getPoemWithIdOrThrow} to get the poem with given Id
 *
 * @param poemId Id of the poem to get
 * @param user The current authenticated user
 * @returns The poem with the given Id and authored by the current user.
 */
export async function getPoemWithIdForUserOrThrow(poemId: string, user: User) {
  let poem: Poem | null = null;

  poem = await getPoemWithIdOrThrow(poemId);

  if (poem.authorId !== user.userId) {
    throw new Response(null, { status: 403, statusText: "Not allowed" });
  }

  return poem;
}
