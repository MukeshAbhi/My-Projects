import { WebSocket } from "ws";
import { RoomManager } from "./roomManager";
import { OutgoingMessage } from "@repo/my-types/nodeTypes";
import client from "@repo/db/client";
import {JwtPayload, verify} from "jsonwebtoken";
import { JWT_SECRET } from "./config";


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
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;

    constructor (private ws : WebSocket) {
        //this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            const parsedData = JSON.parse(data.toString());
            switch (parsedData.type) {
                case "join" : {
                    const spaceId = parsedData.payload.spaceId;
                    if (!this.spaceId) {
                        this.ws.close();
                        return;
                    }
                    
                    const token = parsedData.payload.token;

                    let userId: string | undefined;

                    try {
                        userId = (verify(token, JWT_SECRET) as JwtPayload).userId;
                    } catch (err) {
                        this.ws.close();  // Invalid token
                        return;
                    }  
                    if (!userId){
                        this.ws.close()
                        return;
                    }
                    this.userId = userId;

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
                    this.x = Math.floor(Math.random() * space.width);
                    this.y = Math.floor(Math.random() * space.height)

                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            // Retrieves user IDs for the given spaceId: gets users from the RoomManager, maps them to { id: u.id },
                            // and falls back to an empty array if the room doesn't exist or has no users.
                            users: RoomManager.getInstance().rooms.get(spaceId)?.map((u) => ({id : u.userId})) ?? []
                        }
                    })
                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!)
                    break;
                }
                case "move": {
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);

                    if ((xDisplacement == 1 && yDisplacement == 0) || (yDisplacement == 1 && xDisplacement == 0)){
                        this.x = moveX;
                        this.y = moveY;

                        RoomManager.getInstance().broadcast({
                            type: "move",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                            
                        }, this, this.spaceId!);   
                    }
                    else {
                        RoomManager.getInstance().broadcast({
                            type: "movement-rejected",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        }, this, this.spaceId!)
                    }
                    break;
                }
            }
            

        })
    }

    destroy(){
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            }
        }, this, this.spaceId!)
        RoomManager.getInstance().removeUser(this.spaceId!, this)
    }
    send (payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload))
    }
}

