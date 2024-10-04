import { Form } from "@remix-run/react";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type PoemDeleteDialogProps = {
  trigger: ReactNode;
  action: string; // Form action
  poemTitle?: string;
};

export function PoemDeleteDialog({
  trigger,
  poemTitle,
  action,
}: PoemDeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[350px] sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>
            Delete {poemTitle ? `'${poemTitle}'` : "poem"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the poem?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between">
          <Form action={action} method="post">
            <Button
              className="font-semibold w-full"
              variant={"destructive"}
              type="submit"
            >
              Delete
            </Button>
          </Form>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="mb-3 md:mb-0">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
