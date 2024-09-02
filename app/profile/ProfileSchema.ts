import { z } from "zod";

/**
 * the user schema that makes part of the user profile
 *
 */

export const formSchema = z.object({
  profilePicture: z.string().min(20, {
    message: "Must provide a path to the profile picture in the bucket",
  }),
  penName: z
    .string()
    .min(3, {
      message: "pen name must be a minimum of three characters and unique",
    })
    .max(10),
  bio: z.string().min(8, {
    message: "must be atleast two words",
  })
});
