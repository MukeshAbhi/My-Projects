import { WebSocket } from "ws";
import { RoomManager } from "./roomManager";
import { OutgoingMessage } from "@repo/my-types/nodeTypes";
import client from "@repo/db/client";

//to generate a random string like DfKp9fE2J
const getRandomString = (length : number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

//this === User
export class User {
    public id: string;
    constructor (private ws : WebSocket) {
        this.id = getRandomString(10);
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            const parsedData = JSON.parse(data.toString());
            switch (parsedData.type) {
                case "join" : {
                    const spaceId = parsedData.payload.spaceId;
                    
                    const space = await client.space.findFirst({
                        where : {
                            id : spaceId
                        }
                    })
                    if(!space){
                        this.ws.close();
                        return;
                    }

                    RoomManager.getInstance().addUser(spaceId,this);

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: Math.floor(Math.random() * space.width),
                                y: Math.floor(Math.random() * space.height)
                            },
                            // Retrieves user IDs for the given spaceId: gets users from the RoomManager, maps them to { id: u.id },
                            // and falls back to an empty array if the room doesn't exist or has no users.
                            users: RoomManager.getInstance().rooms.get(spaceId)?.map((u) => ({id : u.id})) ?? []
                        }
                    })
                }
                case "move"
            }
            

        })
    }

    send (payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }
}

