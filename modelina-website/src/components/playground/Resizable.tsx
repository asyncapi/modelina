
import { useMeasure } from '@uidotdev/usehooks';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { type ReactNode, useEffect } from 'react';

interface ResizableComponentProps {
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

// eslint-disable-next-line require-jsdoc
function Resizable({ leftComponent, rightComponent }: ResizableComponentProps) {
  const [ref, { width: containerWidth }] = useMeasure();
  const DefaultWidth = 600;

  const dragableX = useMotionValue(DefaultWidth);
  const width = useTransform(dragableX, (value) => `${value + 0.5 * 4}px`);

  useEffect(() => {
    if (containerWidth !== null) {
      dragableX.set(Math.round(containerWidth / 2));
    }
  }, [containerWidth]);

  return (
    <div ref={ref} className='grid size-full bg-code-editor-dark md:grid-cols-[auto_auto]'>
      <motion.div
        style={{ width }}
      >
        {leftComponent}
      </motion.div>
      <motion.div
        title='drag to resize'
        style={{ x: dragableX }}
        className={'absolute z-50 hidden h-full w-4 cursor-col-resize hover:bg-gray-300/20 active:bg-gray-300/25 md:block'}
        dragMomentum={false}
        drag='x'
        dragElastic={0}
        dragConstraints={{
          left: containerWidth === null ? DefaultWidth * .2 : containerWidth * .2,
          right: containerWidth === null ? DefaultWidth * .8 : containerWidth * .8
        }}
      />
       <motion.div className='overflow-x-scroll'>
        {rightComponent}
       </motion.div>
    </div>
  );
}

Resizable.displayName = 'Resizable Component';

export default Resizable;
