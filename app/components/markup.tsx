import { ClientOnly } from "remix-utils/client-only";
import type { MarkupProps } from "interweave";

import MarkupClientOnly from "./markup.client";

export default function Markup(props: MarkupProps) {
  return <ClientOnly>{() => <MarkupClientOnly {...props} />}</ClientOnly>;
}
