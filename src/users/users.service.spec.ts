import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './user.entity';

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
    const newUserEmail = 'test.email@gmail.com';
    jest.spyOn(userRepository, 'find').mockResolvedValueOnce(undefined);
    service.find(newUserEmail);

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

  it('should be call create', () => {
    const email = 'huytg@email.com';
    const password = '123123321';
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue({ email, password, id: 1 });
    jest.spyOn(userRepository, 'save').mockReturnValue(undefined);
    service.create(email, password);
    expect(userRepository.create).toBeCalled();
    expect(userRepository.save).toBeCalled();
  });

  it('should be call update', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    const existUser = await service.findOne(undefined);
    expect(service.update(undefined, existUser)).rejects.toThrowError(
      'user not found',
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
      }),
    );
    const existUser = await service.findOne(1);
    const user = await service.update(1, existUser);
    expect(user.id).toEqual(5);
  });
});
