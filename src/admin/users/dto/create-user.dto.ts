import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password too week! Must contain minimum 6 characters, at least one UPPERCASE letter, one lowercase letter, one number and one special character!',
    },
  )
  password: string;

  @ApiProperty()
  @IsString()
  role: string;
}
