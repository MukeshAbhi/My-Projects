import { OutgoingMessage } from "./type";
import type { User } from "./user";


export class RoomManager {
    //static Keyword:
    // The rooms property is declared as static, meaning it belongs to the RoomManager class itself, not to any instance of the class.
    // You can access RoomManager.rooms directly without creating an instance of RoomManager.

    rooms: Map<string, User[]>  = new Map();
    static instance: RoomManager

    private constructor () {
        this.rooms = new Map();
    }

     // Creating an Singleton instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
     }

     // add user to a proper instance
     public addUser(spaceId : string, user: User) {
        console.log("RoomManager addUser")
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId,[user]);
            return;
        }
        // getting all  the spaceid and adding new spaceId
        this.rooms.set(spaceId, [...this.rooms.get(spaceId) ?? [], user])
     }

     // remove user from a proper instance 
     public removeUser(user : User, spaceId : string) {
        console.log("RoomManager hi from removeuser")
        if(!this.rooms.has(spaceId)){
            console.log("spcaeId not found")
            return;
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => (u.userId !== user.userId)) ?? []));
     }

     // broadcast message to a proper room 
     public broadcast (message : OutgoingMessage, user: User, spaceId: string) {
        console.log("RoomManager broadcast")
        if (!this.rooms.has(spaceId)) {
            return;
        }
        console.log("RoomManager hi from broadcast")
        this.rooms.get(spaceId)?.forEach((u)=> {
            // other than the sender all should receive the message
            if (u.userId !== user.userId) {
                u.send(message)
            }
        })
     }
}