import React from 'react';
import { Menu, Bell, User, Search, X, Clock, Check, Globe } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(() => [
    { id: 'n1', title: 'New lead', message: 'You have a new lead for Toyota Camry', time: '2h', read: false },
    { id: 'n2', title: 'Image uploaded', message: 'Image added to car #234', time: '1d', read: false },
    { id: 'n3', title: 'Booking confirmed', message: 'Booking BK001 was confirmed', time: '3d', read: true },
  ] as { id: string; title: string; message: string; time: string; read: boolean }[]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [userOpen, setUserOpen] = React.useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const authUser = useAuthStore((s) => s.user);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (notifOpen) setNotifOpen(false);
        if (userOpen) setUserOpen(false);
        if (langOpen) setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen, userOpen, langOpen]);

  const toggleNotif = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    setLangOpen(false);
    setUserOpen(false);
    if (!next) {
      // closed -> clear unread (as requested)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const toggleUser = () => {
    const next = !userOpen;
    setUserOpen(next);
    setNotifOpen(false);
    setLangOpen(false);
  };

  const toggleLang = () => {
    const next = !langOpen;
    setLangOpen(next);
    setNotifOpen(false);
    setUserOpen(false);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotifOpen(false);
  };

  return (
    <header className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            icon={<Menu className="h-6 w-6 text-gray-700" />}
            aria-label="Toggle sidebar"
            className="hover:bg-gray-200 transition-colors"
          />
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="ml-2 text-gray-900 font-semibold text-lg hidden sm:block">Car Admin</span>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Input
              placeholder={t('common.search') + '...'}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2" ref={containerRef}>
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              icon={<Globe className="h-5 w-5 text-gray-700" />}
              aria-label={t('header.language')}
              className="hover:bg-gray-200 transition-colors relative"
            />

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${i18n.language === 'en' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => changeLanguage('en')}
                  >
                    🇺🇸 {t('header.english')}
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${i18n.language === 'es' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => changeLanguage('es')}
                  >
                    🇪🇸 {t('header.spanish')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNotif}
              icon={<Bell className="h-5 w-5 text-gray-700" />}
              aria-label={t('header.notifications')}
              className="hover:bg-gray-200 transition-colors relative"
            />
            {unreadCount > 0 && !notifOpen && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                  <h4 className="font-semibold">{t('header.notifications')}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearAll}
                      className="text-sm text-gray-500 hover:text-gray-700"
                      title={t('header.markAllRead')}
                    >
                      {t('header.markAllRead')}
                    </button>
                    <button onClick={() => { setNotifOpen(false); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }} className="p-1 hover:bg-gray-100 rounded">
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">{t('header.noNotifications')}</div>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 ${n.read ? '' : 'bg-gray-50'}`}>
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                            <p className="text-xs text-gray-500">{n.message}</p>
                          </div>
                          <div className="text-xs text-gray-400">{n.time}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {!n.read && (
                            <button onClick={() => markAsRead(n.id)} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                              <Check className="h-3 w-3" /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUser}
              icon={<User className="h-5 w-5 text-gray-700" />}
              aria-label="User menu"
              className="hover:bg-gray-200 transition-colors relative"
            />

            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-600">{authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{authUser?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{authUser?.email || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => { setUserOpen(false); navigate('/profile'); }}
                  >
                    {t('nav.profile')}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    onClick={() => { logout(); navigate('/login'); }}
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;