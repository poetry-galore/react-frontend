import RichTextEditor from "@poetry-galore/rich-text-editor";
import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Editor() {
  const navigation = useNavigation();

  useEffect(() => console.log(navigation.state), [navigation]);

  return (
    <div className="w-full">
      <RichTextEditor className="m-10 pb-10 max-w-4xl w-2/3 mx-auto dark:bg-dark" />
    </div>
  );
}
