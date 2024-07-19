/**
 * Poem specific functions
 */

import { Poem } from "@prisma/client";
import { prisma } from "~/db/prisma.server";

/**
 * Type of the expected poem data when creating a poem.
 */
export type PoemCreateType = {
  content: string;
  title: string;
  description?: string;
  authorId: string;
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
