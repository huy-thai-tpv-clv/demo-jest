import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be call find', () => {
    // Arrange
    const newUserEmail = 'test.email@gmail.com';
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce(undefined);

    // Act
    service.find(newUserEmail);

    // Assert
    expect(userRepository.find).toBeCalled();
  });

  it('should be call findOne', () => {
    const id = 1;
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    service.findOne(id);
    expect(userRepository.findOneBy).toBeCalled();
  });

  it('should be return null when findOne', () => {
    const res = service.findOne(null);
    expect(res).toEqual(null);
  });

  it('should be call create', async () => {
    // Arrange
    const email = 'huytg@email.com';
    const password = '123123321';
    const spyCreate = jest
      .spyOn(userRepository, 'create')
      .mockImplementation(({ email, password }) => {
        return {
          email,
          password,
          id: 1,
        };
      });

    const spySave = jest
      .spyOn(userRepository, 'save')
      .mockImplementation(({ email, password }) => {
        return Promise.resolve({ email, password, id: 1 });
      });

    // Act
    const user = await service.create(email, password);

    // Assert
    expect(user.email).toEqual(email);
    expect(spyCreate).toHaveBeenCalledTimes(1);
    expect(spySave).toBeCalled();
  });

  it('should be call update', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    const existUser = await service.findOne(undefined);
    expect(service.update(undefined, existUser)).rejects.toThrowError(
      'user not found'
    );
  });

  it('should be call update', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      email: 'huytg@email.com',
      password: '123123321',
    });
    jest.spyOn(userRepository, 'save').mockReturnValue(
      Promise.resolve({
        id: 1,
        email: 'huytg@email.com',
        password: '123123321',
      })
    );
    const existUser = await service.findOne(1);
    const user = await service.update(1, existUser);
    expect(user.id).toEqual(1);
  });

  it('should be call remove', async () => {
    // Arrange
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({
      id: 1,
      email: 'huytg@gmail.com',
      password: '123123321',
    });

    jest.spyOn(userRepository, 'remove').mockResolvedValue({
      id: 1,
      email: 'huytg@gmail.com',
      password: '123123321',
    });

    // Act
    const user = await service.remove(1);

    // Assert
    expect(user.id).toEqual(1);
  });

  it('should be call remove and throw exception', async () => {
    // Arrange
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    jest.spyOn(userRepository, 'remove').mockResolvedValue({
      id: 1,
      email: 'huytg@gmail.com',
      password: '123123321',
    });

    // Act
    const existUser = await service.findOne(1);

    // Assert
    expect(service.remove(existUser?.id)).rejects.toThrowError(
      'user not founddddd'
    );
  });
});
