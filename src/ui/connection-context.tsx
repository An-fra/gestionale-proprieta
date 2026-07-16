// src/ui — contesto React per la connessione. La UI parla solo con src/app (AD-7).
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { Connection, ConnectionState } from '../app/connection.ts';

const ConnectionContext = createContext<Connection | null>(null);

export function ConnectionProvider(props: {
  connection: Connection;
  children: ReactNode;
}) {
  return (
    <ConnectionContext.Provider value={props.connection}>
      {props.children}
    </ConnectionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocato col contesto che consuma
export function useConnection(): {
  state: ConnectionState;
  connect: () => void;
} {
  const connection = useContext(ConnectionContext);
  if (!connection) throw new Error('ConnectionProvider mancante');
  const state = useSyncExternalStore(
    connection.subscribe,
    connection.getState,
  );
  return {
    state,
    connect: () => void connection.connect(),
  };
}
