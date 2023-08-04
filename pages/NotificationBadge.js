import React from 'react';

const NotificationBadge = ({ count }) => {
  return count > 0 ? (
    <div className="notification-badge">
      <span>{count}</span>
    </div>
  ) : null;
};

export default NotificationBadge;