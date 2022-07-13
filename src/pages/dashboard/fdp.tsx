import DraggableList from "@components/draggable-list";

const Index = () => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <main className="flex-1 overflow-y-scroll">
        <DraggableList />
      </main>
    </div>
  );
};

export default Index;
