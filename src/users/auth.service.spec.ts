import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    //create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'pass123');
    expect(user.password).not.toEqual('pass123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'test@test.com', password: 'pass123' } as User,
    //   ]);
    await service.signup('test@test.com', '123123');
    expect.assertions(1);

    // await expect(service.signup('test@test.com', 'pass123')).rejects.toThrow(
    //   'email in use',
    // );
    await expect(
      service.signup('test@test.com', 'pass123'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signin is called with an usused email', async () => {
    await expect(
      service.signin('test@test.com', 'pass123'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws if an invalid password is proviced', async () => {
    await service.signup('test@test.com', '123123');
    await expect(
      service.signin('test@test.com', 'pass123'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'pass');
    const user = await service.signin('test@test.com', 'pass');
    expect(user).toBeDefined();
    // const user = await service.signup('test@test.com', 'pass');
    // console.log(user);
  });
});
