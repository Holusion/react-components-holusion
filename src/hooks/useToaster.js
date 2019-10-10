import React, { useReducer } from 'react';

const toastReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          id: action.id,
          content: action.content,
          title: action.title,
          remove: action.remove,
          time: action.time,
        }
      ];

    case 'remove':
      return [...state.filter(toast => toast.id !== action.id)];
  
    default:
    return state;
  }
};

const timers = {};
const startTimer = (id, removeToast, delay) => {
  if (!timers[id]) {
    timers[id] = setTimeout(() => removeToast(id), delay);
  }
};
const dismiss = (id, removeToast) => {
  console.log("Dismiss : ", id);
  if (timers[id]) {
    clearTimeout(timers[id]);
    delete timers[id];
  }
  removeToast(id);
};

let _uid = 0;
function getUid(){ return ++_uid}

export default () => {
  const [toastList, dispatch] = useReducer(toastReducer, []);
  const removeToast = id => dispatch({ type: 'remove', id });
  
  const addToast = (content, {title="info", duration=10000}={}) => {
    let id = getUid();
    const time = new Date();
    if(0 < duration) startTimer(id, removeToast, duration);
    dispatch({ type: 'add', id, title, content, time: time.toLocaleTimeString(), remove: ()=>dismiss(id, removeToast)});
  };
  return [
    addToast,
    toastList,
  ];
};