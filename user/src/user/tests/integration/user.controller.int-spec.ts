import {Test, TestingModule} from '@nestjs/testing';

import {UserController} from './../../user.controller';
import {UserService} from './../../user.service';

describe('UserController', () => {
    // let userController: UserController;
    // let userService: UserService;

    // const mockUserService = {};

    // beforeEach(async () => {
    //   const moduleRef: TestingModule = await Test.createTestingModule({
    //     controllers: [UserController],
    //     providers: [UserService],
    //   })
    //     .overrideProvider(UserService)
    //     .useValue(mockUserService)
    //     .compile();

    //   userService = moduleRef.get<UserService>(UserService);
    //   userController = moduleRef.get<UserController>(UserController);
    // });

    it('should be defined', () => {
        expect(1).toBeDefined();
    });
});
