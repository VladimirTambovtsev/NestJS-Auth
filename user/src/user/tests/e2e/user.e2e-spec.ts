import * as request from 'supertest';

import {RegisterDto} from '../../dto/register.dto';

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const randomNumber = (min = 0, max = 9999) => Math.random() * (max - min) + min;

const app = 'http://localhost:3000';

describe('UserController (e2e)', () => {
    const number = randomNumber();
    const registeredUser: RegisterDto = {
        email: `test-${number}@gmail.com`,
        password: 'test123!@gmail.com',
        password_confirm: 'test123!@gmail.com',
    };

    describe('Register', () => {
        // Register new user successfully
        describe('Register new user', () => {
            it('/local/register (POST)', () => {
                const user: RegisterDto = {
                    email: `test-${randomNumber()}@gmail.com`,
                    password: 'test123!@gmail.com',
                    password_confirm: 'test123!@gmail.com',
                };
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(201)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                    });
            });
        });

        // Check if user already registered with this email
        describe('Handled user already registered with this email', () => {
            it('/local/register (POST)', () => {
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(registeredUser)
                    .expect(201)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                    });
            });
            it('/local/register (POST)', () => {
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(registeredUser)
                    .expect(409)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(409);
                        expect(body.message).toEqual('User already exists with this email');
                        expect(body.error).toEqual('Conflict');
                    });
            });
        });

        // Password not equals to confirm password
        describe('Password and confirm password match', () => {
            const number = randomNumber();
            const user: RegisterDto = {
                email: `test-${number}@gmail.com`,
                password: 'test123!@gmail.com',
                password_confirm: 'test-not-equal@gmail.com',
            };
            it('/local/register (POST)', () => {
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(400);
                        expect(body.message).toEqual('Passwords do not match');
                        expect(body.error).toEqual('Bad Request');
                    });
            });
        });

        // Invalid email address
        describe('Validates email', () => {
            it('/local/register (POST)', () => {
                const user: RegisterDto = {
                    email: `test-${randomNumber()}`,
                    password: 'test123!@gmail.com',
                    password_confirm: 'test123!@gmail.com',
                };
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(400);
                        expect(body.message[0]).toEqual('email must be an email');
                        expect(body.error).toEqual('Bad Request');
                    });
            });
        });

        // Password is too small
        describe('Password is greater than 12 characters', () => {
            it('/local/register (POST)', () => {
                const user: RegisterDto = {
                    email: `test-${randomNumber()}@gmail.com`,
                    password: 'test123',
                    password_confirm: 'test123',
                };
                return request(`${app}/local/register`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(400);
                        expect(body.message[0]).toEqual('password must be longer than or equal to 12 characters');
                        expect(body.message[1]).toEqual('password_confirm must be longer than or equal to 12 characters');
                        expect(body.error).toEqual('Bad Request');
                    });
            });
        });
    });

    describe('Login', () => {
        // Login user successfully
        describe('Login existing user with email and password', () => {
            it('/local/login (POST)', () => {
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(registeredUser)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                    });
            });
        });

        // Email or password is not exists
        describe('Handle email or password is not exists', () => {
            it('/local/login (POST)', () => {
                const user: RegisterDto = {
                    email: `doesnotexist-test-${randomNumber()}@gmail.com`,
                    password: 'test123!@gmail.com',
                    password_confirm: 'test123!@gmail.com',
                };
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(404)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(404);
                        expect(body.message).toEqual('Invalid credentials');
                        expect(body.error).toEqual('Not Found');
                    });
            });
        });

        // Email is invalid
        describe('Handle email is invalid', () => {
            it('/local/login (POST)', () => {
                const user: RegisterDto = {
                    email: `doesnotexist-test-${randomNumber()}`,
                    password: 'test123!@gmail.com',
                    password_confirm: 'test123!@gmail.com',
                };
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(400);
                        expect(body.message[0]).toEqual('email must be an email');
                        expect(body.error).toEqual('Bad Request');
                    });
            });
        });

        // password is shorter than 12 characters
        describe('Handle password is shorter than 12 characters', () => {
            it('/local/login (POST)', () => {
                const user: RegisterDto = {
                    email: `doesnotexist-test-${randomNumber()}@gmail.com`,
                    password: 'test',
                    password_confirm: 'test',
                };
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(400);
                        expect(body.message[0]).toEqual('password must be longer than or equal to 12 characters');
                        expect(body.error).toEqual('Bad Request');
                    });
            });
        });
    });

    describe('Logout', () => {
        // Logout user successfully
        describe('Logout user successfully', () => {
            let accessToken;
            it('/local/login (POST)', () => {
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(registeredUser)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                        accessToken = body.access_token;
                    });
            });
            it('/local/logout (POST)', () => {
                return request(`${app}/local/logout`).post('/').set('Accept', 'application/json').set('Authorization', `Bearer ${accessToken}`).send(registeredUser).expect(200);
            });
        });

        // Invalid acesss token JWT to logout
        describe('Handle error for invalid access JWT', () => {
            it('/local/logout (POST)', () => {
                return request(`${app}/local/logout`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer some-invalid-access-token`)
                    .expect(401)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(401);
                        expect(body.message).toEqual('Unauthorized');
                    });
            });
        });
    });

    describe('Refresh JWT token', () => {
        // Refreshed access token successfully updated by refresh token
        describe('Logout user successfully', () => {
            let refreshToken;
            it('/local/login (POST)', () => {
                return request(`${app}/local/login`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .send(registeredUser)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                        refreshToken = body.refresh_token;
                    });
            });
            it('/local/refresh (POST)', () => {
                return request(`${app}/local/refresh`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${refreshToken}`)
                    .expect(200)
                    .expect(({body}) => {
                        expect(body.access_token).toBeDefined();
                        expect(body.access_token.length).toBeGreaterThan(140);
                        expect(body.refresh_token).toBeDefined();
                        expect(body.refresh_token.length).toBeGreaterThan(140);
                        refreshToken = body.refresh_token;
                    });
            });
        });

        // Invalid refresh token was provided
        describe('Handle invalid refresh token', () => {
            it('/local/refresh (POST)', () => {
                return request(`${app}/local/refresh`)
                    .post('/')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer some-invalid-refresh-token`)
                    .expect(401)
                    .expect(({body}) => {
                        expect(body.statusCode).toEqual(401);
                        expect(body.message).toEqual('Unauthorized');
                    });
            });
        });
    });

    describe('Verify email address from confirmation link received on mail', () => {
        // Field 'isEmailConfirmed' updated to true in database
        // describe('Verify email successfully', () => {
        //     let refreshToken;
        //     it('/local/login (POST)', () => {
        //         return request(`${app}/local/login`)
        //             .post('/')
        //             .set('Accept', 'application/json')
        //             .send(registeredUser)
        //             .expect(200)
        //             .expect(({body}) => {
        //                 expect(body.access_token).toBeDefined();
        //                 expect(body.access_token.length).toBeGreaterThan(140);
        //                 expect(body.refresh_token).toBeDefined();
        //                 expect(body.refresh_token.length).toBeGreaterThan(140);
        //                 refreshToken = body.refresh_token;
        //             });
        //     });
        // });
    });
});
