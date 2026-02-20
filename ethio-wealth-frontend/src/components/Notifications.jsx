import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <FaCheckCircle className="text-green-500" />;
            case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
            case 'error': return <FaTimesCircle className="text-red-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow focus:outline-none"
            >
                <FaBell className="text-gray-600" size={16} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-orange rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-brand-orange hover:text-orange-600 font-medium transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-[24rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                                <FaBell className="mb-2 opacity-20" size={32} />
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group p-4 border-b border-gray-50 hover:bg-gray-50 transition-all duration-200 ${notification.is_read ? 'opacity-60 bg-gray-50/30' : 'bg-white'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${notification.is_read ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium uppercase tracking-wide">
                                                {new Date(notification.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-orange transition-all p-1 hover:bg-orange-50 rounded-full"
                                                title="Mark as read"
                                            >
                                                <FaCheck size={10} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
