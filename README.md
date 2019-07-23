# react-components-holusion : a collection of components made with react

## Components

### Button

A button is a clickable component that fits with its parent container https://material.io/design/components/buttons.html#specs

| Props    | Types               | Description              |
| -------- | ------------------- | ------------------------ |
| children | string or component | It is the button content |

### Card

A card is a component that describe an item which can have an image and some interaction (like selection)

| Props   | Types                  | Description                       |
| ------- | ---------------------- | --------------------------------- |
| top     | One or more components | Represents the top of the card    |
| primary | One or more components | Represents the all the card       |
| bottom  | One or more components | Represents the bottom of the card |
| image   | string                 | The background image              |

### PlaylistItem

A PlaylistItem is a card that represents an item of a Playlist

| Props | Types  | Description                            |
| ----- | ------ | -------------------------------------- |
| item  | object | The item that will be change in a card |
| image | string | The background image                   |

the props item should have this properties :

```javascript
{
    "name": string,
    "rank": int,
    "active": bool,
    "_id": string,
    "onCheckboxChange": func(item, event),
    "onSwitchChange": func(item, event),
    "onClick": func(item, event),
    "onPlay": func(item, event),
    "onRemove": func(item, event),
    "current": bool,
    "selected": bool,
    "visible": bool,
    "image": string
}
```

### Playlist

A Playlist is a collection of PlaylistItem create by a collection of items

| Props | Types           | Description                                               |
| ----- | --------------- | --------------------------------------------------------- |
| items | array of object | A collection of items that will be passed on PlaylistItem |