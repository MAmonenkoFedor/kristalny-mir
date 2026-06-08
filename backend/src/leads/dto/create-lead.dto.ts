import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Укажите имя' })
  @MinLength(2, { message: 'Имя слишком короткое' })
  @MaxLength(80)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Укажите телефон' })
  @MinLength(6, { message: 'Некорректный телефон' })
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  service?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
