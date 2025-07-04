import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Provider, Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsEnum(Role)
  role: Role;

  @IsString()
  @Length(2, 20, { message: '이름은 2자 이상 20자 이하이어야 합니다.' })
  @Matches(/^[가-힣a-zA-Z]+$/, {
    message:
      '이름은 한글 또는 영어만 가능하며, 공백과 특수문자는 사용할 수 없습니다.',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^010\d{8}$/, {
    message:
      '휴대폰 번호는 하이픈(-)을 제외한 010으로 시작하는 11자리 숫자여야 합니다. (예: 01012345678)',
  })
  phone?: string;

  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @IsOptional()
  @IsString()
  @Length(8, 20, { message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.' })
  @Matches(
    /^(?!.*\s)(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,20}$/,
    {
      message:
        '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 하며 공백 없이 입력해야 합니다.',
    },
  )
  password?: string;

  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider = Provider.LOCAL; // 로그인 제공자 (예: 'local', 'naver', 'kakao', 'google' 등)

  @IsString()
  @IsOptional()
  providerId?: string; // 소셜 로그인 제공자의 고유 ID (예: 네이버의 경우 사용자 ID)
}
