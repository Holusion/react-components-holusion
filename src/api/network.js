'use strict'
import io from'socket.io-client';

const constant = {
    HTTP_CODE: {
        success: 200,
        noContent: 204
    }
}

export function synchronize(url, onSocketUpdate) {
    const socket = io(`http://${url}/playlist`);
    socket.on('disconnect', () => {
        // errorBox = errorHandler("danger","Déconnecté.",-1);
    });
    socket.on('disconnected',() => {
        // errorHandler('danger','Socket Disconnected!')
    })
    socket.on('connect',() => {
        // if(errorBox){ errorBox.remove();errorBox = null;}
        socket.emit("get");
    })
    socket.on("current", () => {
        onSocketUpdate('current-playlist');
    });
    socket.on('update', () => {
        onSocketUpdate('update-playlist')
    });
    socket.on('remove', () => {
        onSocketUpdate('remove-playlist');
    });
    socket.on('insert', () => {
        onSocketUpdate('insert-playlist')
    })

    return () => {
        if(socket) socket.close();
    };
}

export async function requestUpdate(url, method, targetPath, body){
    let opts = {};
    if (typeof body === "object"){
        opts.json = body;
    }
    let headers = {
        'Content-Type': 'application/json'
    }
    let options = {
        method: method.toUpperCase(),
        headers: headers,
    }

    if(body) {
        options.body = JSON.stringify(body)
    }

    try {
        let res = await fetch(`http://${this.url}${encodeURI(targetPath)}`, options);
        if(res.status === 200) {
            return res;
        } else {
            throw new ErrorWrapper(`HTTPError: ${res.status}`, new Error(`${options.method}: ${url}${targetPath} - (${res.status}) ${res.statusText}`));
        }
    } catch(err) {
        throw new ErrorWrapper(`HTTPError: ${err.status}`, err);
    }
}

export async function getPlaylist(url) {
    let r = []
    try {
        let res = await fetch(`http://${url}/playlist`);
        if(res) {
        switch(res.status) {
            case constant.HTTP_CODE.success:
                r = await res.json();
                break;
            case constant.HTTP_CODE.noContent:
                r = []
                break;
            default:
                throw new HTTPError(res.status, res.statusText);
        }           
        }
    } catch(e) {
        if (e.type != 'invalid-json'){
        // console.warn("Invalid response : ",e);
        throw new ErrorWrapper(e.type, e);
        }
    }
    return r;
}

export async function toggleActivation(url, elem) {
    let info = {name: elem.name, path: elem.path, rank: elem.rank}
    return await this.requestUpdate(url, "put", "/playlist", Object.assign(info,{active:elem.active}));
}

export async function play(url, elem) {
    return await this.requestUpdate(url, "put", `/control/current/${elem.name}`);
}

export async function remove(url, elem) {
    return await this.requestUpdate(url, "delete", `/medias/${elem.name}`, null);
}