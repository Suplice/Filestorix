interface FileDateCellProps {
  date: Date;
}

const FileDateCell: React.FC<FileDateCellProps> = ({ date }) => {
  return <p>{new Date(date).toLocaleString()}</p>;
};

export default FileDateCell;
