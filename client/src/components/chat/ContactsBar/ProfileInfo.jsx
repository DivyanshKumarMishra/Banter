import { useSelector } from 'react-redux';
import Avatar from '../../common/Avatar';
import getShortName from '../../../utils';

function ProfileInfo() {
  const { name, email } = useSelector((state) => state.user.userInfo);

  return (
    <div className="bg-primary flex flex-1 flex-col items-center justify-center w-full max-w-xs mx-auto">
      <div className="relative mb-4">
        <Avatar
          className="bg-gray-200 size-36 rounded-full shadow-md"
          textSize="text-xl"
          color="#ffffff"
          text={getShortName(name)}
        />
      </div>
      <div className="text-center w-full space-y-2">
        <div className="text-2xl sm:text-3xl md:text-3xl font-semibold text-white">{name}</div>
        <div className="text-sm md:text-md lg:text-lg text-gray-200">{email}</div>
      </div>
    </div>
  );
}

export default ProfileInfo;