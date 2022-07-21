import { AnimatePresence, motion } from "framer-motion";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from "react";

interface ToastOptions {
  duration: number;
  transition: {
    duration: number;
  };
}

interface ToastProps {
  options: ToastOptions;
  children: React.ReactNode;
}

export interface ToastElement {
  show(): void;
  hide(): void;
}

export const Toast = memo(
  forwardRef<ToastElement, ToastProps>((props, ref) => {
    const [show, setShow] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const [id, increment] = useReducer((state) => state + 1, 1);

    useImperativeHandle(ref, () => ({
      show() {
        if (show === false) {
          setShow(true);
          timer.current = setTimeout(() => {
            setShow(false);
          }, props.options.duration);
        } else {
          increment();
        }
      },
      hide() {
        if (show === true) {
          setShow(false);
          if (timer.current) {
            clearTimeout(timer.current);
          }
        }
      },
    }));

    useEffect(() => {
      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    }, []);

    return (
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            key={id}
            transition={{
              duration: props.options.transition.duration,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  })
);
