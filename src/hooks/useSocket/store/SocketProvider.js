import { SocketContext } from './context';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

export default function SocketProvider(props) {
    const [socket, setSocket] = useState(io(props.url))

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    url: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
}





