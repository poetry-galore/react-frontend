import { createClient } from "@supabase/supabase-js";
import { v4 } from "uuid";

const supabaseUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, anonKey);

export async function uploadPhoto(photo: File) {
  if (typeof photo === "object" && photo) {
    const fileExt = photo.type.split("/")[1];
    const fileName = `${v4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("profile pictures")
      .upload(filePath, photo, {
        contentType: photo.type,
      });

    if (error) {
      return { error: error.message, fullPath: null };
    }
    return data;
  }
  return { error: "invalid file" };
}
