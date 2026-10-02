import Image from "next/image";
import { RxAvatar } from "react-icons/rx";

interface AvatarProps {
  src?: string | null;
}

const Avatar = ({ src }: AvatarProps) => {
  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
      {src ? (
        <Image
          src={src}
          alt="Profile avatar"
          fill
          sizes="32px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <RxAvatar
            size={20}
            className="text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )}

      <span
        className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background bg-primary"
        aria-hidden="true"
      />
    </div>
  );
};

export default Avatar;