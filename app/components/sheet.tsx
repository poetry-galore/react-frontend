import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Form, Link } from "@remix-run/react";
import { LogOutIcon } from "lucide-react";


export function ProfileSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"outline"}>User Details</Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    A slight display of your details
                </SheetHeader>
                <SheetDescription>
                    .........................
                </SheetDescription>
                <div className="grid gap-4 py-4">
                    <div className="">
                        <p> email: test@dummy</p>
                        <p> 5 poems posted</p>
                        <p> 34 poems bookmarked</p>
                    </div>
                   
                </div>
                <SheetFooter>
                    <SheetClose>
                        <Link to={"/profile"}>
                        <Button variant={"outline"}>Update your details!</Button>
                        </Link>
                         
                        <Form method="post" action="/logout" className="group/logout">
                            <Button
                                size={"default"}
                                className="text-lg font-semibold border-none text-red-500 bg-inherit hover:bg-inherit hover:text-red-400 rounded-lg dark:text-red-500 dark:bg-inherit hover:dark:bg-inherit hover:dark:text-red-400"
                                variant={"secondary"}
                                type="submit"
                            >
                                Logout
                                <LogOutIcon className="ms-1 w-4 h-4 group-hover/logout:translate-x-1.5 group-hover/logout:scale-110 duration-300 motion-reduce:scale-0 motion-reduce:translate-x-0" />
                            </Button>
                        </Form>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}