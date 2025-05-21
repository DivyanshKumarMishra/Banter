import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Animation from '../../animation';
import Logo from '../../common/Logo';

function EmptyChatContainer({handleSidebar = () => {}}) {
  return (
    <div className='h-full'>
      <div className='h-[10vh] bg-indigo-100 flex'>
        <button className='md:hidden' onClick={handleSidebar}>
          <ArrowRightIcon className='text-white bg-primary size-6 focus:border-none focus:outline-none duration-300 transition-all' />
        </button>
      </div>
      <div className="flex-1 h-full flex flex-col justify-start items-center duration-1000 transition-all">
        <Animation className="size-72 md:size-80" />
        <Logo className="text-5xl" />
      </div>
    </div>
  );
}

export default EmptyChatContainer;
