import { SocketContext } from './context';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

export default function SocketProvider(props) {
    const [socket] = useState(io(props.url))
    console.info("render socketProvider");
    socket.on("error",function(e){
        console.error("Socket.io client error : ", e);
    })
    socket.on("connect",function(){
        console.info("socket.io client connected to path : ", props.url);
    })
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





