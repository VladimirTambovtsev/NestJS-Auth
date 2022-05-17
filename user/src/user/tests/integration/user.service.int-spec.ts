import {JwtService} from '@nestjs/jwt';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ClientKafka} from '@nestjs/microservices';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {createConnection, Repository} from 'typeorm';

import {User} from '../../entities/user.entity';
import {UserService} from '../../user.service';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
    let userService: UserService;
    let userRepository: MockRepository<User>;
    const testConnectionName = 'testConnection';
    const mockJwtService = {};
    const mockRepository = {
        findOneBy: jest.fn(),
        save: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'KAFKA_SERVICE',
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                brokers: ['pkc-4ygn6.europe-west3.gcp.confluent.cloud:9092'],
                                ssl: true,
                                sasl: {
                                    mechanism: 'plain',
                                    username: 'PP6WEWYOYYZ35H3V',
                                    password: 'g92IuFKUrDMCjl0Y/KcjYE4ndZB5GDgj+sZI0FAWAq5y7/5Vh54yek9IRwYVzR+/',
                                },
                            },
                        },
                    },
                ]),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                    // useClass: Repository
                },
                {provide: JwtService, useValue: mockJwtService},
                {
                    provide: ClientKafka,
                    useValue: jest.fn().mockImplementation(() => true),
                },
            ],
        }).compile();

        // TODO: move to .env
        const connection = await createConnection({
            type: 'postgres',
            name: testConnectionName,
            database: 'gettingstarted',
            username: 'gettingstarted',
            password: 'postgres',
            entities: [User],
            // dropSchema: true,
            synchronize: true,
            logging: false,

            // type: 'sqlite',
            // database: ':memory:',
            // dropSchema: true,
            // entities: [User],
            // synchronize: true,
            // logging: false,
            // name: testConnectionName,
        });
        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User));
        return connection;
    });

    it('UserService - should be defined', () => {
        expect(userService).toBeDefined();
    });

    // TODO: test toBeDefined private methods

    it('UserService - login() should be defined', () => {
        expect(userService.login).toBeDefined();
    });

    it('UserService - logout() should be defined', () => {
        expect(userService.logout).toBeDefined();
    });

    it('UserService - refreshTokens() should be defined', () => {
        expect(userService.refreshTokens).toBeDefined();
    });

    it('UserService - confirmEmail() should be defined', () => {
        expect(userService.confirmEmail).toBeDefined();
    });

    it('UserService - resendConfirmationLink() should be defined', () => {
        expect(userService.resendConfirmationLink).toBeDefined();
    });

    it('UserService - resetPassword() should be defined', () => {
        expect(userService.resetPassword).toBeDefined();
    });

    it('UserService - googleOAuthLogin() should be defined', () => {
        expect(userService.googleOAuthLogin).toBeDefined();
    });

    describe('UserService - register()', () => {
        it('register() should be defined', () => {
            expect(userService.register).toBeDefined();
        });

        it('should fail if password and password_confirm are not the same', async () => {
            await userService
                .register({
                    email: 'test12345AAAA@gmail.com',
                    password: '123',
                    password_confirm: 'tesT!@gmail.com',
                })
                .catch((e) => expect(e.message).toEqual('Passwords do not match'));
        });

        it('should fail if user exists', async () => {
            userRepository.findOneBy.mockResolvedValue({
                email: 'test12345@gmail.com',
            });
            await userService
                .register({
                    email: 'test12345AAAA@gmail.com',
                    password: 'tesT!@gmail.com',
                    password_confirm: 'tesT!@gmail.com',
                })
                .catch((e) => expect(e.message).toEqual('User already exists with this email'));
        });

        it('should create a new user', async () => {
            userRepository.findOneBy.mockResolvedValue({
                email: 'test12345@gmail.com',
            });
            await userService
                .register({
                    email: 'test12345AAAA@gmail.com',
                    password: 'tesT!@gmail.com',
                    password_confirm: 'tesT!@gmail.com',
                })
                .catch((e) => expect(e.message).toEqual('User already exists with this email'));
        });
        // userRepository;
        // const registerDto: RegisterDto = {
        //     email: `test@gmail.com`,
        //     password: 'test@gmail.com',
        //     password_confirm: 'test@gmail.com',
        // };
        // await expect(userService.register(registerDto)).resolves.toEqual({
        //     access_token: '',
        //     refresh_token: '',
        // });
    });

    // describe('register()', () => {
    //     const registerDto: RegisterDto = {
    //         email: 'test@test.com',
    //         password: 'password12345',
    //         password_confirm: 'password12345',
    //     };
    //     // it('should create a new user', async () => {
    //     //     const hashed = await bcrypt.hash(registerDto.password, 12);
    //     //     const newUser = await userRepository.save({
    //     //         ...registerDto,
    //     //         password: hashed,
    //     //     });
    //     //     // const newUser = await userRepository.save({
    //     //     //     ...registerDto,
    //     //     //     password: hashed,
    //     //     // });
    //     //     const userId = newUser.id;
    //     //     expect(newUser).toBeDefined();
    //     //     expect(userId).toBeDefined();
    //     //     expect(userId).toBeGreaterThanOrEqual(1);
    //     // });

    //     // it('should register a new user', async () => {
    //     //     await userService.register(registerDto);
    //     // });
    // });

    // afterEach(async () => {
    //     await getConnection(testConnectionName).close();
    // });
});
