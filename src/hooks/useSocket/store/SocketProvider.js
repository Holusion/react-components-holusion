import { SocketContext } from './context';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';

export default function SocketProvider(props) {
    const [socket, setSocket] = useState();

    useEffect(()=>{
        const socket = io(props.url);
        setSocket(socket);
        return ()=>{
            socket.close();
        }
    },[]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
}





