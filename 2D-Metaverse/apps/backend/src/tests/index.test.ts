import { describe, test, expect} from 'vitest';
import request from 'supertest';
import { app }  from '../index';

const BACKEND_URL = "http://localhost:3000"

describe("Authentication", () => {
    test("User is able to sign up ONLY Once", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(200);

        const updatedResponse = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type: "admin"
        })
        expect(updatedResponse.statusCode).toBe(400);

    });

    test("Signup request fails if username is empty", async () => {
        const username = `abhi-${Math.random()}`;
        const password = '123456';

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            password,
            type: "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test("Signin succeeds if the username and password are correct ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username,
            password
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("Signin fails if the username and password is incorrect ", async () => {
        const username = `abhi-${Math.random()}`;
        const password = "123456";
        await request(app).post(`${BACKEND_URL}/api/v1/signup`).send({
            username,
            password,
            type : 'admin'
            });

        const response = await request(app).post(`${BACKEND_URL}/api/v1/signin`).send({
            username : "WrongUsername",
            password
        });

        expect(response.statusCode).toBe(403);
    });
})