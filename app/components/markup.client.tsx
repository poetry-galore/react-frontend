import { Markup } from "interweave";
import type { MarkupProps } from "interweave";

export default function MarkupClientOnly(props: MarkupProps) {
  return <Markup {...props} />;
}
