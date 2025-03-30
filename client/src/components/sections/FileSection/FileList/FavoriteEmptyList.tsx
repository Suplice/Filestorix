const FavoriteEmptyList = () => {
  return (
    <div className="w-full  flex items-center justify-center flex-col">
      <div className="flex items-center justify-center gap-2 flex-col ">
        <img
          src="/empty_favorite_list.png"
          alt="test"
          className="h-48 aspect-auto "
        ></img>
        <h1 className="text-2xl font-semibold">No favorite files found</h1>
        <p>Head on and mark some files as favorite!</p>
      </div>
    </div>
  );
};

export default FavoriteEmptyList;
