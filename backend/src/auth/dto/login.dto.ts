import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Укажите корректный email' })
  email!: string;

  @IsString()
  @MinLength(4, { message: 'Пароль слишком короткий' })
  password!: string;
}
