"use client";

import { useCallback, useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

interface FaqItemProps {
  data: {
    title: string;
    description: string;
  };
}

const FaqItem = ({ data }: FaqItemProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className="w-full rounded-xl border-custom2 px-4 py-3">
      <button
        type="button"
        onClick={handleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-medium leading-5 text-secondary-foreground">
          {data.title}
        </span>

        {open ? (
          <AiOutlineMinus
            size={16}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />
        ) : (
          <FiPlus
            size={16}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <p className="mt-3 pr-6 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          {data.description}
        </p>
      )}
    </div>
  );
};

export default FaqItem;