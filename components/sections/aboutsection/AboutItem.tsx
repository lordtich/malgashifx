interface AboutItemProps {
  title: string;
  subtitle: string;
}

export const AboutItem: React.FC<AboutItemProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex h-[130px] w-full flex-col items-center justify-center rounded-xl border border-custom2 p-4 text-center">
      <span className="text-lg font-semibold tracking-tight text-primary sm:text-xl">
        {title}
      </span>

      <span className="mt-1 text-xs leading-5 text-muted-foreground">
        {subtitle}
      </span>
    </div>
  );
};