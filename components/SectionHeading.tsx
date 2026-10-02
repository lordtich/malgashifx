interface SectionProps {
  title: string;
}

export const SectionHeading: React.FC<SectionProps> = ({ title }) => {
  return (
    <h2 className="text-lg font-semibold leading-tight tracking-tight text-secondary-foreground sm:text-xl">
      {title}
    </h2>
  );
};