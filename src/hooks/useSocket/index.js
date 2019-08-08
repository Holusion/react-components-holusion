import {useContext, useEffect, useState} from 'react';
import { SocketContext } from './store/context';

export function useSocket(eventKey, initial) {
    const socket = useContext(SocketContext);
    const [data, setData] = useState(initial);
    
    useEffect(() => {
        if(!socket) return;
        const handler = function (data){
            console.log("Socket.on("+eventKey+")", data);
            setData(data);
        }
        socket.on(eventKey, handler);
        return () => socket.removeListener(eventKey, handler);
    }, [socket, eventKey]);

    return data;
}

export function useSocketState(){
    const socket = useContext(SocketContext);
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if(!socket) return;
        const onconnected = function(){
            console.log("connected");
            setConnected(true);
        }
        const ondisconnected = function(){
            setConnected(false);
        }
        socket.on("connect", onconnected);
        socket.on("disconnect", ondisconnected);
        return () => {
            socket.removeListener("connected", onconnected);
            socket.removeListener("disconnected", ondisconnected);
        }
    },[socket]);
    return connected;
}

export {default as SocketProvider} from './store/SocketProvider'