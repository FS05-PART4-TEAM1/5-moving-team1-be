import {
  ServiceRegion,
  ServiceRegionMap,
  ServiceType,
  ServiceTypeMap,
} from '@/common/const/service.const';
import { HasAtLeastOneTrue } from '@/common/validator/service.validator';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateMoverProfileDto {
  @IsString()
  @Length(2, 20, { message: '별명은 2자 이상 20자 이하여야 합니다.' })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message:
      '별명은 한글, 영문, 숫자만 사용할 수 있으며 공백 및 특수문자는 허용되지 않습니다.',
  })
  nickname: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  @Min(0, { message: '경력은 최소 0이상 입력해야 합니다.' })
  @Max(99, { message: '경력은 최대 99까지 입력해야 합니다.' })
  experience: number;

  @IsString()
  @Length(8, 50, { message: '소개는 8자 이상 50자 이하 입니다.' })
  @Matches(/^[^\r\n]*$/, {
    message: '소개에는 줄바꿈을 포함할 수 없습니다.',
  })
  intro: string;

  @IsString()
  @Length(10, 500, { message: '설명은 10자 이상 500자 이하 입니다.' })
  description: string;

  @IsObject()
  @HasAtLeastOneTrue(ServiceType, {
    message: '서비스 타입은 최소 하나 이상 선택되어야 합니다.',
  })
  serviceType: ServiceTypeMap;

  @IsObject()
  @HasAtLeastOneTrue(ServiceRegion, {
    message: '서비스 지역은 최소 하나 이상 선택되어야 합니다.',
  })
  serviceRegion: ServiceRegionMap;
}
