import {useContext, useEffect, useRef} from 'react';
import { SocketContext } from './store/context';

export function useSocket(eventKey, callback) {
    const socket = useContext(SocketContext);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        if(eventKey) {
            const socketHandler = () => callbackRef.current && callbackRef.current.apply(this, arguments);
            socket.on(eventKey, socketHandler);
            return () => socket.removeListener(eventKey, socketHandler);
        }
    }, [eventKey]);

    return socket;
}

export {default as SocketProvider} from './store/SocketProvider'