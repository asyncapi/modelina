
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface ResizableComponentProps {
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
}

// eslint-disable-next-line require-jsdoc
function Resizable({ leftComponent, rightComponent }: ResizableComponentProps) {
  const DefaultWidth = 400;
  const dragableX = useMotionValue(DefaultWidth);
  const width = useTransform(dragableX, (value) => `${value + 0.5 * 4}px`);

  return (
    <div className='grid size-full bg-code-editor-dark md:grid-cols-[auto_auto]'>
      <motion.div
        style={{ width }}
      >
        {leftComponent}
      </motion.div>
      <motion.div
        title='drag to resize'
        style={{ x: dragableX }}
        className={'absolute z-50 hidden h-full w-4 cursor-col-resize hover:bg-gray-300/20 md:block'}
        dragMomentum={false}
        drag='x'
        dragElastic={0}
        dragConstraints={{
          left: DefaultWidth - 100,
          right: DefaultWidth + 400
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
