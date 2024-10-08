/**
 * Poem specific functions
 */

import { Poem, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "~/auth/authenticator.server";
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

export type PoemWithAuthor = Poem & {
  author: {
    id?: string;
    email?: string;
  };
};

type PoemOrderBy =
  | Prisma.PoemOrderByWithRelationInput
  | Prisma.PoemOrderByWithRelationInput[]
  | undefined;

type PoemSelect = Prisma.PoemSelect | undefined;

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
async function _deletePoem(poemId: string) {
  return await prisma.poem.delete({ where: { id: poemId } });
}

/**
 * Deletes a poem if poem's author is the given user else an error is thrown.
 *
 * @param poem Poem to delete
 * @param user Author of the poem
 */
export async function deletePoemForUser(poem: Poem, user: User) {
  if (poem.authorId === user.userId) {
    await _deletePoem(poem.id);
  } else {
    throw new Response(null, { status: 403, statusText: "Not allowed" });
  }
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
 * Gets a poem with the given id together with the author
 * and if the poem is not found, a Response with status 404 is thrown.
 *
 * If any other error occurs, a Response with status 500 is thrown.
 *
 * @param poemId Id of the poem to get
 * @returns The poem with the given id with the author included
 */
export async function getPoemAndAuthorOrThrow(poemId: string) {
  try {
    return await prisma.poem.findUniqueOrThrow({
      where: { id: poemId },
      include: { author: { select: { id: true, email: true } } },
    });
  } catch (error: any) {
    if (
      error.code === "P2025" ||
      error instanceof PrismaClientKnownRequestError
    ) {
      throw new Response(null, { status: 404, statusText: "Poem not found" });
    } else if (error instanceof Response) {
      throw error;
    } else {
      throw new Response(null, { status: 500, statusText: "Server error" });
    }
  }
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

/**
 * Ensures the password is falsified in the UserSelect so that it is not returned
 * when the author is selected.
 *
 * @param select PoemSelect in which to falsify the password in the UserSelect.
 *
 * @returns New PoemSelect with the password field set to `false`.
 */
function falsifyPasswordInUserSelect(select: PoemSelect) {
  const userSelect: Prisma.UserSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    email: true,
  };

  if (select && select["author"]) {
    if (select["author"] === true) {
      select["author"] = { select: { ...userSelect, password: false } };
    } else if (select["author"]["select"]?.password) {
      select["author"]["select"].password = false;
    }
  }

  return select;
}

/**
 * Get many poems.
 *
 * @param take Number of poems to get
 * @param skip Number of poems to skip
 * @param select Which fields of the poem to select
 * @returns Array of poems
 */
export async function getPoems(
  take?: number,
  skip?: number,
  select?: PoemSelect,
) {
  select = falsifyPasswordInUserSelect(select);

  return await prisma.poem.findMany({
    take,
    skip,
    select,
  });
}

/**
 * Get many poems with the authors included.
 *
 * Selects only the author `id` and `email`.
 *
 * @param take Number of poems to get
 * @param skip Number of poems to skip
 * @param select Which fields of the poem to select
 * @returns Array of poems with the authors included.
 */
export async function getPoemsAndAuthors(
  take?: number,
  skip?: number,
  select?: PoemSelect,
): Promise<PoemWithAuthor[]> {
  const poemSelect: PoemSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    description: true,
    content: true,
    authorId: true,
    author: { select: { id: true, email: true } }, // include author
  };

  select = falsifyPasswordInUserSelect({ ...poemSelect, ...select });

  // @ts-expect-error
  return await prisma.poem.findMany({
    take,
    skip,
    select,
  });
}

/**
 * Gets poems authored by the user with the given id.
 *
 * By default, they are ordered by the `updatedAt` field in
 * descending order.
 *
 * @param userId Id of the user to select the poems for
 * @param orderBy Fields and SortOrder to order the results by.
 * @returns An array of poems authored by the user with given id.
 */
export async function getPoemsAuthoredByUser(
  userId: string,
  orderBy: PoemOrderBy = { updatedAt: "desc" },
) {
  return await prisma.poem.findMany({
    where: { authorId: userId },
    orderBy: orderBy,
  });
}
