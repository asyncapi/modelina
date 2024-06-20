import React, { useState } from 'react';

interface InfoModalProps {
  text: string;
  children: React.ReactNode;
}

export default function InfoModal(props: InfoModalProps) {
  const [showModal, setShowModal] = useState(false);

  const onOpenModal = () => {
    setShowModal(true);
    document.body.style.overflowY = 'hidden';
  };

  const onCloseModal = () => {
    setShowModal(false);
    document.body.style.overflowY = 'scroll';
  };

  const MyModal = () => {
    return (
      <>
        <div className='fixed inset-0 bg-black bg-opacity-10' onClick={onCloseModal} style={{ zIndex: 1000 }}></div>
        <div
          className='fixed left-1/2 top-1/2 max-w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-2 text-black'
          style={{ zIndex: 1001 }}
        >
          <div className='px-3 py-2 font-mono text-sm'>
            <div className=' mb-3 flex justify-between'>
              <h2>{props.text}</h2>
              <button
                onClick={onCloseModal}
                className='-mr-2 -mt-1 aspect-1 items-center justify-center rounded-full border-2 border-slate-200 p-1 px-2 text-xs'
              >
                <p>X</p>
              </button>
            </div>
            <div className='max-h-64 min-w-40 overflow-y-auto'>{props.children}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <button onClick={onOpenModal}>
        <div className='flex size-5 items-center justify-center rounded-full bg-slate-600 p-1'>
          <svg className=' ' width='7' height='13' viewBox='0 0 7 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M5.25 0C4.2875 0 3.5 0.73125 3.5 1.625C3.5 2.51875 4.2875 3.25 5.25 3.25C6.2125 3.25 7 2.51875 7 1.625C7 0.73125 6.2125 0 5.25 0ZM2.625 4.0625C1.1725 4.0625 0 5.15125 0 6.5H1.75C1.75 6.045 2.135 5.6875 2.625 5.6875C3.115 5.6875 3.5 6.045 3.5 6.5C3.5 6.955 1.75 9.165 1.75 10.5625C1.75 11.96 2.9225 13 4.375 13C5.8275 13 7 11.9112 7 10.5625H5.25C5.25 11.0175 4.865 11.375 4.375 11.375C3.885 11.375 3.5 11.0175 3.5 10.5625C3.5 9.9775 5.25 7.5725 5.25 6.5C5.25 5.18375 4.0775 4.0625 2.625 4.0625Z'
              fill='#DBD9D9'
            />
          </svg>
        </div>
      </button>
      {showModal && <MyModal />}
    </>
  );
}
