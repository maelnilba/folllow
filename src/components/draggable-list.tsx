import { useState, useEffect } from "react";
import {
  Reorder,
  useDragControls,
  useMotionValue,
  animate,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faGripVertical,
  faPlusCircle,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";

function removeItem<T>([...arr]: T[], item: T) {
  const index = arr.indexOf(item);
  index > -1 && arr.splice(index, 1);
  return arr;
}

const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.onChange((latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value, boxShadow]);

  return boxShadow;
}

interface DraggableList<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export default function DraggableList<T>({
  items,
  renderItem,
}: DraggableList<T extends { id: number } ? T : never>) {
  const [list, setList] = useState(items);
  const remove = (item: typeof list[number]) => {
    setList(removeItem(items, item));
  };
  const add = () => {
    setList([{ id: list.length + 1 } as any, ...list]);
  };

  return (
    <div className="flex flex-col p-4 ">
      <Reorder.Group
        axis="y"
        values={list}
        onReorder={setList}
        layoutScroll
        style={{ overflowY: "scroll" }}
        className="flex w-full flex-col items-center space-y-4"
      >
        <div className="flex">
          <button className="btn gap-2 normal-case" onClick={() => add()}>
            <FontAwesomeIcon icon={faPlusCircle} />
            New one
          </button>
        </div>

        <AnimatePresence initial={false}>
          {list.map((item) => (
            <Item key={item.id} item={item} removeItem={remove}>
              {renderItem(item)}
            </Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

interface ItemProps<T> {
  item: T;
  children: React.ReactNode;
  removeItem(item: T): void;
}
function Item<T>({
  item,
  children,
  removeItem,
}: ItemProps<T extends { id: number } ? T : never>) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={"" + item.id}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kard flex w-full flex-row space-x-2 p-6"
    >
      <div
        className="flex flex-col items-center justify-center"
        onPointerDown={(event) => dragControls.start(event)}
      >
        <FontAwesomeIcon
          icon={faGripVertical}
          className="text-2xl hover:cursor-grab active:cursor-grabbing"
        />
      </div>
      <div className="flex flex-grow">{children}</div>
      <div
        className="flex flex-col items-start justify-center"
        onClick={(event) => {
          event.stopPropagation();
          removeItem(item);
        }}
      >
        <FontAwesomeIcon icon={faXmarkSquare} className="text-xl" />
      </div>
    </Reorder.Item>
  );
}
