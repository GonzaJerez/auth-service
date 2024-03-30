import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JWTPayloadDto } from './dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDoctorDto: LoginUserDto) {
    const { email, password } = loginDoctorDto;

    let user: User;
    try {
      user = await this.usersModel.findOne({ email });
    } catch (error) {
      console.log(error);
    }

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new NotFoundException('La contraseña es incorrecta');
    }

    const token = this.generateToken({ user_id: user._id });

    return {
      user,
      token,
    };
  }

  async findUserById(id: string) {
    const user = await this.usersModel.findById(id);

    if (!user) throw new NotFoundException('El usuario no existe');

    return user;
  }

  async checkToken(user: User) {
    const newToken = this.generateToken({ user_id: user._id });

    return {
      user,
      token: newToken,
    };
  }

  generateToken(payload: JWTPayloadDto) {
    return this.jwtService.sign(payload);
  }

  // TODO metodo para recibir doctores de sqs (nuevos, actualizaciones, seed) y guardarlos en db
  async handleMessage(users: User[]) {
    console.log({ users });

    for (const user of users) {
      let userCreated = await this.usersModel.findByIdAndUpdate(
        user._id,
        user,
        {
          new: true,
        },
      );

      if (!userCreated) {
        userCreated = await this.usersModel.create(user);
      }
    }

    return users;
  }
}
