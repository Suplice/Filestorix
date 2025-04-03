interface AppSidebarResizerProps {
  onMouseDown: () => void;
}

const AppSidebarResizer: React.FC<AppSidebarResizerProps> = ({
  onMouseDown,
}) => {
  return (
    <div
      className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-300 hover:bg-gray-400 select-none"
      draggable="false"
      onMouseDown={onMouseDown}
    />
  );
};

export default AppSidebarResizer;
