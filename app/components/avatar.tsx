import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

type UserAvatarProps = {
  userName?: string;
  email?: string;
  profilePic?: string;
} & React.AllHTMLAttributes<HTMLDivElement>;

export function UserAvatar({
  userName,
  email,
  profilePic,
  ...rest
}: UserAvatarProps) {
  const alt = userName ? userName : email;
  const fallback = userName
    ? userName.slice(0, 2)
    : email
      ? email.slice(0, 2)
      : "PG";

  return (
    <div {...rest}>
      <Avatar>
        <AvatarImage src={profilePic} alt={alt} />
        <AvatarFallback className="text-xl bg-slate-200">
          {fallback.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
