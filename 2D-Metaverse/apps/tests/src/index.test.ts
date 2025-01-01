import { describe, test, expect, beforeAll} from 'vitest';
import request from 'supertest';
import { WebSocket } from 'ws';

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const adminCreate = async () => {
    let adminId;
    let adminToken;

    const username = `abhi-${Math.random()}`;
    const password = '123456';

    const adminSignupResponse = await request(BACKEND_URL).post(`/api/v1/signup`).send({
        username,
        password,
        type: "admin"
    });

    adminId = adminSignupResponse.body.userId;

    const adminSignInResponse = await request(BACKEND_URL).post(`/api/v1/signin`).send({
        username,
        password
    })
    adminToken = adminSignInResponse.body.token;

    return { adminId, adminToken}
}

const userCreate = async () => {
    let userId;
    let userToken;

    const username = `abhiI-${Math.random()}`;
    const password = '123456';

    const signupResponse = await request(BACKEND_URL).post(`/api/v1/signup`).send({
        username,
        password,
        type: "user"
    });

    userId = signupResponse.body.userId;

    const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
        username,
        password
    })
    userToken = response.body.token;

    return {userId, userToken }

}

const mapAndElementsCreate = async (adminToken : string) => {
    
    let mapId;
    let element1Id;
    let element2Id;

    const element1Response = await request(BACKEND_URL).post(`/api/v1/admin/element`).send({
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
    }).set({
        "authorization" : `Bearer ${adminToken}`
    });
   
    const element2Response = await request(BACKEND_URL).post(`/api/v1/admin/element`).send({
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
    }).set({
        "authorization" : `Bearer ${adminToken}`
    });

    element1Id = element1Response.body.elementId;
    element2Id = element2Response.body.elementId;

    const mapResponse = await request(BACKEND_URL).post(`/api/v1/admin/map`).send({
        "thumbnail": "https://thumbnail.com/a.png",
        "dimensions": "100x200",
        "name": "100 person interview room",
        "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            }, {
              elementId: element2Id,
                x: 18,
                y: 20
            }, {
              elementId: element1Id,
                x: 19,
                y: 20
            }, {
              elementId: element2Id,
                x: 19,
                y: 20
            }
        ]
     }).set({
        "authorization" : `Bearer ${adminToken}`
    });
    mapId = mapResponse.body.id;

    return {mapId,element1Id,element2Id};
}
// completed
describe("Authentication", () => {
    test("User is able to sign up ONLY Once", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const response = await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(200);

        const updatedResponse = await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(updatedResponse.statusCode).toBe(400);

    });

    test("Signup request fails if username is empty", async () => {
        const password = '123456';

        const response = await request(BACKEND_URL).post(`/api/v1/signup`).send({
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test("Signup request fails if pssword is empty", async () => {
        const username = `abhi-${Math.random()}`
        const response = await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            type: "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test("Signup request fails if password is less than 6 letters", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '12345';

        const response = await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test("Signin succeeds if the username and password are correct ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
            username,
            password
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("Signin fails if the username  is incorrect ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
            username : "WrongUsername",
            password
        });

        expect(response.statusCode).toBe(403);
    });

    test("Signin fails if the password  is incorrect ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
            username ,
            password : "wrongpassword"
        });

        expect(response.statusCode).toBe(403);
    });

    test("Signin fails if the username  empty ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
            password
        });

        expect(response.statusCode).toBe(403);
    });

    test("Signin fails if the password is empty ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(BACKEND_URL).post(`/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(BACKEND_URL).post(`/api/v1/signin`).send({
            username,
        });

        expect(response.statusCode).toBe(403);
    });

    // add more auth tests for robust backend
});

//completed
describe("User metadata data endpoints", () => {
    let adminToken = '';
    let userToken = '';
    let avatarId = '';

    beforeAll(async () => {

        ({adminToken} = await adminCreate());
        ({userToken} = await userCreate());

        const avataResponse = await request(BACKEND_URL).post(`/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }).set({"authorization" : `Bearer ${adminToken}`});

        avatarId = avataResponse.body.id
    })

    test("User cant update their metadata with an invalid avatar ID", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/user/metadata`).send({
            avatarId : "123456789789" // Invalid Id
        }).set({"authorization": `Bearer ${userToken}`})
        expect(response.statusCode).toBe(400);
    })

    test("User can update their metadata with a valid avatar ID", async () => {
        const precursor = await request(BACKEND_URL).post(`/api/v1/user/addmetadata`).send({
            avatarId 
        }).set({"authorization": `Bearer ${userToken}`})
        const response = await request(BACKEND_URL).post(`/api/v1/user/metadata`).send({
            avatarId 
        }).set({"authorization": `Bearer ${userToken}`})
        expect(response.statusCode).toBe(200);
    })
    
    test("User is not able to update there meta data if not provide auth header", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/user/metadata`).send({
            avatarId
        });
        expect(response.statusCode).toBe(401);
    })
});

//completed
describe("User avatar information", () => {
    let userToken  = '';
    let avatarId = '';
    let userId = '';
    let userId1 = '';
    let adminToken = '';
    let avatarId1 = '';
    let userToken1 = '';

    beforeAll(async () => {
        
       ({userId, userToken } = await userCreate());
       ({adminToken} = await adminCreate());

        const avataResponse = await request(BACKEND_URL).post(`/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }).set({"authorization" : `Bearer ${adminToken}`})

        avatarId = avataResponse.body.id;

        ({userId: userId1,userToken: userToken1 } = await userCreate());

        const avataResponse1 = await request(BACKEND_URL).post(`/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }).set({"authorization" : `Bearer ${adminToken}`})

        avatarId1 = avataResponse1.body.id;
    })

    test("Get back avatar information for a user", async () => {
        const response = await request(BACKEND_URL).get(`/api/v1/user/metadata/bulk?ids=[${userId},${userId1}]`).set({
            "authorization" :`Bearer ${userToken}`
        });

        expect(response.body.avatars.length).toBe(1);
        expect(response.body.avatars[0].userId).toBe(userId1);
    });

    test("Available avatars lists the reacently created avatars", async () => {
        const response = await request(BACKEND_URL).get(`/api/v1/avatars`).set({
            "authorization" :`Bearer ${userToken}`
        });

        expect(response.body.avatars.length).not.toBe(0);

        const currentAvatar = response.body.avatars.find((x: { id: string; }) => x.id === avatarId);
        expect(currentAvatar).toBeDefined();

    })
});

//completed
describe("Space information", () => {
    let mapId = "";
    let adminToken = "";
    let userToken = "";

    beforeAll(async () => {
        
        ({adminToken} = await adminCreate());

        ({mapId} = await mapAndElementsCreate(adminToken));

        ({userToken} = await userCreate());

    })

    test("User is able to create a Sapce", async () => {
        console.log(mapId);
        const response = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
       }).set({"authorization" : `Bearer ${userToken}`});

       expect(response.body.spaceId).toBeDefined();
    });

    test("User is able to create a space without mapId(empty space)", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});

        expect(response.body.spaceId).toBeDefined();
    })

    test("User is NOT able to create a space without mapId(empty space) AND dimensions", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test"
        }).set({"authorization" : `Bearer ${userToken}`});
        expect(response.statusCode).toBe(400);
    })

    test("User is NOT able to delete a space that does not exisst", async () => {
        const response = await request(BACKEND_URL).delete(`/api/v1/space/randomeSpaceId`)
            .set({"authorization" : `Bearer ${userToken}`});
        expect(response.statusCode).toBe(400);
    })

    test("User is able to delete a space that does exisst", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});

        const deleteResponse = await request(BACKEND_URL).delete(`/api/v1/space/${response.body.spaceId}`)
            .set({"authorization" : `Bearer ${userToken}`});

        expect(deleteResponse.statusCode).toBe(200);
    })

    test("user should not able to delete a space created by another user", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${userToken}`});

        const deleteResponse = await request(BACKEND_URL).delete(`/api/v1/space/${response.body.spaceId}`)
            .set({"authorization" : `Bearer ${adminToken}`});

        expect(deleteResponse.statusCode).toBe(403);
    })

    test("Admin has no spaces initially", async () => {
        const response = await request(BACKEND_URL).get(`/api/v1/space/all`).set({"authorization" : `Bearer ${adminToken}`});
        expect(response.body.spaces.length).toBe(0);
    })

    test("Admin has a spaces initially", async () => {
        const spaceCreatedResponse = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200"
        }).set({"authorization" : `Bearer ${adminToken}`});

        const response = await request(BACKEND_URL).get(`/api/v1/space/all`).set({"authorization" : `Bearer ${adminToken}`});
        const filteredSpace = response.body.spaces.find((x: any) => x.id == spaceCreatedResponse.body.spaceId );
        expect(response.body.spaces.length).toBe(1);
        expect(filteredSpace).toBeDefined();
    })
    
})

//completed
describe("Arena endPoins", () => {
    let mapId = "";
    let element1Id = "";
    let adminToken = "";
    let userToken = "";
    let spaceId = "";
    
    beforeAll(async () => {
        ({adminToken} = await adminCreate());

        ({mapId,element1Id} = await mapAndElementsCreate(adminToken));

        ({userToken} = await userCreate());
  
        const spaceResponse = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200",
            "mapId" : mapId
        }).set({"authorization": `Bearer ${userToken}`});

        spaceId = spaceResponse.body.spaceId;
    })

    test("Incorrect space Id return a 400", async () => {
        const response = await request(BACKEND_URL).get(`/api/v1/space/123dmskkds22`).set({"authorization": `Bearer ${userToken}`});
        expect(response.statusCode).toBe(400);
    })

    test("correct spaceId returns all elements", async () => {
        const response = await request(BACKEND_URL).get(`/api/v1/space/${spaceId}`).set({
            "authorization": `Bearer ${userToken}`
        });
        
        expect(response.body.dimensions).toBe('100x200');
        expect(response.body.elements.length).toBe(4);
    })

    test("Addind an element works as expected", async () => {
        await request(BACKEND_URL).post(`/api/v1/space/element`).send({
            "elementId" : element1Id ,
            "spaceId" : spaceId,
            "x" : 50,
            "y" : 20
        }).set({"authorization": `Bearer ${userToken}`});

        const newResponse = await request(BACKEND_URL).get(`/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});

        expect(newResponse.body.elements.length).toBe(5);
    })

    test("Delete an element ", async () => {
    
        const response = await request(BACKEND_URL).get(`/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});
        
        await request(BACKEND_URL).delete(`/api/v1/space/element`)
        .set({"authorization": `Bearer ${userToken}`})
        .send({elementId : response.body.elements[0].id});
        

        const newResponse = await request(BACKEND_URL).get(`/api/v1/space/${spaceId}`).set({"authorization": `Bearer ${userToken}`});

        expect(newResponse.body.elements.length).toBe(response.body.elements.length - 1);
    })

    test("Addind an element fails if element lies outside the dimensions", async () => {
        const response = await request(BACKEND_URL).post(`/api/v1/space/element`).send({
                "elementId" : element1Id,
                "spaceId" : spaceId,
                "x" : 3000,
                "y" : 2000
        }).set({"authorization": `Bearer ${adminToken}`});

        expect(response.statusCode).toBe(400)
    })
})

//completed
describe("Admin endPoints", () => {
    let adminToken = "";
    let adminId = "";
    let userId = "";
    let userToken = "";
        
    beforeAll(async () => {
        ({adminId,adminToken} = await adminCreate());

        ({userId,userToken} = await userCreate());
    })

    test("user is not able to hit admin endpoints", async () => {
        const elementResponse = await request(BACKEND_URL).post(`/api/v1/admin/element`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }).set({
            "authorization" : `Bearer ${userToken}`
        });

        const mapResponse = await request(BACKEND_URL).post(`/api/v1/admin/map`).send({
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": []
         }).set({
            "authorization" : `Bearer ${userToken}`
        });

        const avatarResponse = await request(BACKEND_URL).post(`/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }).set({"authorization" : `Bearer ${userToken}`})

        const updateElementResponse = await request(BACKEND_URL).put(`/api/v1/admin/element/123`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"
        }).set({"authorization" : `Bearer ${userToken}`})

        expect(elementResponse.statusCode).toBe(403);
        expect(mapResponse.statusCode).toBe(403);
        expect(avatarResponse.statusCode).toBe(403);
        expect(updateElementResponse.statusCode).toBe(403);
    });

    test("Admin able to hit admin endpoints", async () => {
        const elementResponse = await request(BACKEND_URL).post(`/api/v1/admin/element`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }).set({
            "authorization" : `Bearer ${adminToken}`
        });

        const mapResponse = await request(BACKEND_URL).post(`/api/v1/admin/map`).send({
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": []
         }).set({
            "authorization" : `Bearer ${adminToken}`
        });

        const avatarResponse = await request(BACKEND_URL).post(`/api/v1/admin/avatar`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }).set({"authorization" : `Bearer ${adminToken}`})

        expect(elementResponse.statusCode).toBe(200);
        expect(mapResponse.statusCode).toBe(200);
        expect(avatarResponse.statusCode).toBe(200);
        
    });

    test("Admin is able to update element", async () => {
        const elementResponse = await request(BACKEND_URL).post(`/api/v1/admin/element`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }).set({
            "authorization" : `Bearer ${adminToken}`
        });
        console.log(elementResponse.body.elementId)
        const updateElementResponse = await request(BACKEND_URL).put(`/api/v1/admin/element/${elementResponse.body.elementId}`).send({
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s"
        }).set({"authorization" : `Bearer ${adminToken}`})

        expect(updateElementResponse.statusCode).toBe(200);

    })

})

//completed
describe("WebSockets tests", () => {
    let mapId = "";
    let adminToken = "";
    let adminId = "";
    let userId = "";
    let userToken = "";
    let spaceId = "";

    let ws1: WebSocket;
    let ws2: WebSocket;
    let ws1Messages : string[] = [];
    let ws2Messages : string[] = [];
    let userX = "";
    let userY = "";
    let adminX = "";
    let adminY = "";
    
    const setUpHttp = async () => {

        ({adminId,adminToken} = await adminCreate());
        
        ({mapId} = await mapAndElementsCreate(adminToken));

        ({userId,userToken} = await userCreate());

        const spaceResponse = await request(BACKEND_URL).post(`/api/v1/space`).send({
            "name" : "Test",
            "dimensions" : "100x200",
            "mapId" : mapId
        }).set({"authorization": `Bearer ${userToken}`});

        spaceId = spaceResponse.body.spaceId;
        
    }
    
    const setUpWs = async () => {
        ws1 = new WebSocket(WS_URL);
    
        await new Promise ( resolve => {
            ws1.onopen = resolve
        })
        ws1.onmessage = (event : any) => {
            ws1Messages.push(JSON.parse(event.data))
        }

        ws2 = new WebSocket(WS_URL);

        await new Promise ( resolve => {
            ws2.onopen = resolve
        })
        ws2.onmessage = (event : any) => {
            ws2Messages.push(JSON.parse(event.data))
        }
    }

    const waitForAndPopulateTheLatestMessage = (messageArray : string[]) => {
       return new Promise ( resolve => {
         // Immediately resolve if the array has elements
            if(messageArray.length > 0) {
                resolve(messageArray.shift())
            }else {
                 // Poll the array every 100ms
                const interval = setInterval(() => {
                    if(messageArray.length > 0) {
                        resolve(messageArray.shift())
                        clearInterval(interval);// Stop polling once resolved
                    }
                },100)
            }
       }) 
    }

    beforeAll(async () => {
        
        await setUpHttp();
        await setUpWs();
    })

    test("Get back an acknowledgement for joining the space", async () => {
        
        ws1.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": `Bearer ${adminToken}`
            }
        }))
        const message1 : any = await waitForAndPopulateTheLatestMessage(ws1Messages);

        ws2.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": `Bearer ${userToken}`
            }
        }))

        
        const message2 : any = await waitForAndPopulateTheLatestMessage(ws2Messages);
        const message3 : any = await waitForAndPopulateTheLatestMessage(ws1Messages)

        expect(message1.type).toBe("user-joined")
        expect(message2.type).toBe("user-joined")

        // the first joined user receives an empty array and next person recevies an arry with one user i.e the previously joined user
        expect(message1.payload.users.length).toBe(0);
        expect(message2.payload.users.length).toBe(1);
        expect(message3.type).toBe("user-joined");
        expect(message3.payload.x).toBe(message2.payload.spawn.x);
        expect(message3.payload.y).toBe(message2.payload.spawn.y);
        expect(message3.payload.userId).toBe(userId);


        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        userX = message1.payload.spawn.x;
        userY = message1.payload.spawn.y;
    })

    test("User should not be able to move across the boundry of the wall", async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: 1000000,
                y: 1000000
            }
        }));

        const message : any = await waitForAndPopulateTheLatestMessage(ws1Messages);
        console.log(message)
        expect(message.type).toBe('movement-rejected')
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    })

    test("User should not be able to move two blocks",async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: adminX + 2,
                y: adminY + 2,
                userId: adminId
            }
        }));

        const message : any = await waitForAndPopulateTheLatestMessage(ws1Messages);
        expect(message.type).toBe('movement-rejected')
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    })

    test("Correct movement should be broadcasted to other sockets in the room",async () => {
        ws1.send(JSON.stringify({
            type: "move",
            payload: {
                x: adminX + 1,
                y: adminY
            }
        }));

        const message : any = await waitForAndPopulateTheLatestMessage(ws2Messages);
        expect(message.type).toBe('move')
        expect(message.payload.x).toBe(adminX + 1);
        expect(message.payload.y).toBe(adminY);
    })

    test("If a user leaves, the others user receives a leave event",async () => {
        console.log("hiihiijjcjas")
        ws1.close();

        const message : any = await waitForAndPopulateTheLatestMessage(ws2Messages);
        console.log(message)
        expect(message.type).toBe('user-left')
        expect(message.payload.userId).toBe(adminId);
    })
 })