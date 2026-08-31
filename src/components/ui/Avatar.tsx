import type { AuthUser } from "../../types/auth";

/**
 * Avatar — círculo de perfil reutilizable.
 */
type AvatarSize = "sm" | "md" | "lg";

const sizeClass: Record<AvatarSize, string> = {
  sm: "w-9 h-9 text-[13px]",
  md: "w-12 h-12 text-[16px]",
  lg: "w-16 h-16 text-[20px]",
};

type AvatarProps = {
  user: Pick<AuthUser, "name" | "surname" | "profilePictureUrl"> | null | undefined;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ user, size = "md", className }: AvatarProps) {
  const initials = [user?.name?.[0], user?.surname?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const classes = [
    "rounded-full flex items-center justify-center shrink-0 overflow-hidden font-bold text-white",
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (user?.profilePictureUrl) {
    return (
      <img
        src={user.profilePictureUrl}
        alt={`Foto de perfil de ${user.name ?? "usuario"}`}
        className={classes}
      />
    );
  }

  return (
    <div className={classes} style={{ backgroundImage: "var(--gradient-swoosh)" }}>
      {initials || "?"}
    </div>
  );
}