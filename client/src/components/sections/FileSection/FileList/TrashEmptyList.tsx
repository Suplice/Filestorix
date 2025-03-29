const TrashEmptyList = () => {
  return (
    <div className="w-full  flex items-center justify-center flex-col mt-8">
      <div className="flex items-center justify-center gap-2 flex-col ">
        <img
          src="/empty_trash.png"
          alt="test"
          className="h-48 aspect-auto "
        ></img>
        <h1 className="text-2xl font-semibold">No trashed files found</h1>
        <p>Try marking some files as trashed!</p>
      </div>
    </div>
  );
};

export default TrashEmptyList;
