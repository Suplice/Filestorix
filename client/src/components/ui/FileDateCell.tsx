"use client";
import { useMemo } from "react";

interface FileDateCellProps {
  date: Date | string;
}

const FileDateCell: React.FC<FileDateCellProps> = ({ date }) => {
  const formattedDate = useMemo(() => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [date]);

  return <p>{formattedDate}</p>;
};

export default FileDateCell;
