// NetworkStatusIndicator.jsx
import React from 'react';
import useOnlineStatus from '../hooks/useOnlineStatus';

export default function NetworkStatusIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {isOnline ? '✅ You are online' : '❌ You are offline'}
    </div>
  );
}
