import { useEffect, useState } from 'react';
import {
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Logo from '../../common/Logo';
import { LOGOUT_URL } from '../../../utils/constants';
import { logout } from '../../../redux/slices/userSlice';
import NewDM from './NewDM';
import ContactList from '../ContactList';
import protectedAxios from '../../../services/axiosService';
import ProfileInfo from './ProfileInfo';
import { getDMs } from '../../../redux/slices/chatSlice';

function ContactsContainer({
  setNotificationText = () => {},
  handleSidebar = () => {},
  setShow = () => {},
}) {
  const [activeTab, setActiveTab] = useState('dm');
  const { dms, selectedChat } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDMs());
  }, [selectedChat])

  const tabs = [
    { id: 'dm', label: 'Direct Messages', icon: ChatBubbleLeftEllipsisIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'logout', label: 'Logout', icon: ArrowLeftStartOnRectangleIcon },
  ];

  const handleTabClick = async (id) => {
    if (id === 'logout') {
      await handleLogout();
    } else {
      setActiveTab(id);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await protectedAxios.post(LOGOUT_URL, {});
      const { message, details } = response.data;
      if (response.status === 200) {
        setNotificationText({
          message: message,
          type: 'success',
          details: details,
        });
        setShow(true);
        setTimeout(() => {
          setNotificationText({});
          dispatch(logout());
          setShow(false);
          navigate('/auth');
        }, 3000);
      }
    } catch (error) {
      const { message, cause } = error.response.data;
      setNotificationText({ message: message, type: 'error', details: cause });
      setShow(true);
      setTimeout(() => {
        setNotificationText({});
        setShow(false);
      }, 3000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="h-15 flex items-center justify-between">
        <Logo className="text-white text-3xl p-4 bg-primary" />
        <button className="p-4 md:hidden" onClick={handleSidebar}>
          <XMarkIcon className="text-white hover:text-primary hover:bg-white rounded-full size-6 focus:border-none focus:outline-none duration-300 transition-all" />
        </button>
      </div>
      <div className="flex flex-1">
        <div className="w-16 flex flex-col justify-between items-center py-4 bg-primary">
          <div className="flex flex-col gap-3 items-center">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`p-2 rounded-lg transition 
                  ${
                    activeTab === id
                      ? 'bg-white text-primary'
                      : 'text-white hover:bg-white hover:text-primary'
                  }`}
              >
                <Icon className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 py-5 overflow-auto">
          {activeTab === 'profile' && <ProfileInfo />}
          {activeTab === 'dm' && (
            <div className="flex flex-col gap-3">
              <NewDM
                label="Direct Messages"
                handleSidebar={handleSidebar}
              />
              <div className="max-h-[70vh] overflow-y-auto scrollbar-hidden">
                <ContactList contacts={dms} handleSidebar={handleSidebar} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactsContainer;
