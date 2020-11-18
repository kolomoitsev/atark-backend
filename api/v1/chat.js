const users = [];

const addUser = ({ userId, roomId }) => {

    const user = { userId, roomId }

    users.push(user)

    return { user }
}

const getUser = ({ id, room }) => {

    const user = users.find(user => user.userId === id && user.roomId === room)

    return user
}

const removeUser = (id) => {

    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0];
    }

}

const getUsersInRoom = (room) => {
    const users = users.filter(user => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }