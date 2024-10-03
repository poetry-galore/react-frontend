import { prisma } from "~/db/prisma.server";


export type Bookmark = {
    id: string;
    userId: string;
    itemId: string;
    createdAt: Date;
}


/**
 * Gets all the bookmarks of a given user
 * 
 * @param userId Id of the user associated with the bookmarks
 * @returns an array of bookmarks associated with the userID
 */
export async function getBookmarks(userId: string): Promise<Bookmark[]> {
    return await prisma.bookmark.findMany({
        where: { userId },
        orderBy: {createdAt: "desc"}
    })
}

/**
 * Adds a bookmark if it does not exist or deletes one f it existed and adds it.
 * 
 * @param userId Id of the user 
 * @param itemId ID of the poem the user is trying to bookmark.
 */
export async function toggleBookmark(userId:string, itemId: string): Promise<void> {

    const bookmark = await prisma.bookmark.findFirst({
        where: { userId, itemId }
    })

    if (bookmark) {
        await prisma.bookmark.delete({
            where: {id: bookmark.id}
        })
    } else {
        await prisma.bookmark.create({
            data: { userId, itemId}
        })
    }
}

/**
 * Checks if a poem has already been bookmarked by a user or not
 * @param userId ID of the user
 * @param itemId ID of the poem
 * @returns true if already bookmarked or false
 */
export async function isBookMarked(userId: string, itemId: string): Promise<Boolean> {
    const bookmark = await prisma.bookmark.findFirst({
        where: { userId, itemId}
    })

    return !!bookmark
}

