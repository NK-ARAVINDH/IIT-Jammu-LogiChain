import { useState, useEffect, useCallback, useRef } from 'react';
import { createWebSocket } from '../api/client';

export function useWebSocket() {
  const [agentUpdates, setAgentUpdates] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const refreshCallbackRef = useRef(null);

  useEffect(() => {
    const ws = createWebSocket((message) => {
      setLastMessage(message);
      setIsConnected(true);

      if (message.type === 'agent_update') {
        setAgentUpdates(prev => {
          const existing = prev.findIndex(
            u => u.agent === message.data.agent && u.workflow_id === message.data.workflow_id
          );
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = message.data;
            return updated;
          }
          return [...prev, message.data];
        });
      }

      if (message.type === 'dashboard_refresh' || message.type === 'workflow_complete') {
        if (refreshCallbackRef.current) {
          refreshCallbackRef.current();
        }
      }
    });

    wsRef.current = ws;
    setIsConnected(true);

    return () => {
      ws.close();
      setIsConnected(false);
    };
  }, []);

  const clearAgentUpdates = useCallback(() => {
    setAgentUpdates([]);
  }, []);

  const onDashboardRefresh = useCallback((callback) => {
    refreshCallbackRef.current = callback;
  }, []);

  return {
    agentUpdates,
    lastMessage,
    isConnected,
    clearAgentUpdates,
    onDashboardRefresh,
  };
}
