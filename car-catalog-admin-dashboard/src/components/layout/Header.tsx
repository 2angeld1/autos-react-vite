import React from 'react';
import { Menu, Bell, User, Search, X, Clock, Check, Globe, Zap } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuthStore } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGet, useApi } from '@/hooks/useApi';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);

  // Real notifications from API
  const {
    data: notifResponse,
    execute: fetchNotifications
  } = useGet<any>('/notifications', { immediate: true });

  const { execute: markReadApi } = useApi();
  const { execute: markAllReadApi } = useApi();

  const notifications = React.useMemo(() => {
    if (notifResponse?.success) {
      return notifResponse.data || [];
    }
    return [];
  }, [notifResponse]);

  const unreadCount = notifResponse?.unreadCount || 0;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [userOpen, setUserOpen] = React.useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const authUser = useAuthStore((s) => s.user);

  // Poll for new notifications every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

    // Auto-fetch when opening
    if (next) {
      fetchNotifications();
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

  const markAsRead = async (id: string) => {
    await markReadApi(`/notifications/${id}/read`, { method: 'PATCH' });
    fetchNotifications();
  };

  const clearAll = async () => {
    await markAllReadApi('/notifications/read-all', { method: 'PATCH' });
    fetchNotifications();
    setNotifOpen(false);
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), {
        addSuffix: true,
        locale: i18n.language === 'es' ? es : enUS
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            icon={<Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />}
            aria-label="Toggle sidebar"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          />
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="ml-2 font-semibold text-lg hidden sm:block text-gray-900 dark:text-white">
              Velo<span className="text-orange-600">Drive</span>
            </span>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Input
              placeholder={t('common.search') + '...'}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
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
              icon={<Globe className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
              aria-label={t('header.language')}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
            />

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${i18n.language === 'en' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => changeLanguage('en')}
                  >
                    🇺🇸 {t('header.english')}
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${i18n.language === 'es' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
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
              icon={<Bell className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
              aria-label={t('header.notifications')}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
            />
            {unreadCount > 0 && !notifOpen && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('header.notifications')}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearAll}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      title={t('header.markAllRead')}
                    >
                      {t('header.markAllRead')}
                    </button>
                    <button onClick={() => setNotifOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('header.noNotifications')}</div>
                  )}
                  {notifications.map((n: any) => (
                    <div key={n._id || n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${n.read ? '' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{formatTime(n.createdAt)}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {!n.read && (
                            <button onClick={() => markAsRead(n._id || n.id)} className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                              <Check className="h-3 w-3" /> {t('header.markRead')}
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
              icon={<User className="h-5 w-5 text-gray-700 dark:text-gray-200" />}
              aria-label="User menu"
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
            />

            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{authUser?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{authUser?.email || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    onClick={() => { setUserOpen(false); navigate('/profile'); }}
                  >
                    {t('nav.profile')}
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
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