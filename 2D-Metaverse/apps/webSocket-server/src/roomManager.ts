import { User } from "./user";

export class RoomManager {
    //static Keyword:
    // The rooms property is declared as static, meaning it belongs to the RoomManager class itself, not to any instance of the class.
    // You can access RoomManager.rooms directly without creating an instance of RoomManager.

     rooms: Map<string, User[]>  = new Map();
     static instance: RoomManager

    private constructor () {
        this.rooms = new Map();
     }

     static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
     }

     public addUser() {

     }

}