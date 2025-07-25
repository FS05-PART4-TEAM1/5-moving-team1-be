import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateMoverProfileDto } from '../dto/create-mover-profile.dto';
import { UpdateMoverProfileDto } from '../dto/update-mover-profile.dto';
import {
  CODE_200_SUCCESS,
  CODE_201_CREATED,
  CODE_400_BAD_REQUEST,
  CODE_401_RESPONSES,
  CODE_404_NOT_FOUND,
} from '@/common/docs/response.swagger';
import {
  MessageSchema,
  MoverProfileDetailSchema,
  MoverProfileListSchema,
} from '@/common/docs/schema.swagger';
import {
  CreateMoverProfileFullExample,
  UpdateMoverProfileFullExample,
} from '@/common/docs/body.swagger';
import {
  cursorValidationError,
  descriptionValidationError,
  experienceValidationError,
  imageUrlValidationError,
  introValidationError,
  moverProfileNotFoundError,
  nicknameValidationError,
  orderValidationError,
  serviceRegionValidationError,
  serviceTypeValidationError,
  takeValidationError,
} from '@/common/docs/validation.swagger';
import {
  cursorQuery,
  orderQuery,
  serviceRegionQuery,
  serviceTypeQuery,
  takeQuery,
} from '@/common/docs/query.swagger';

export const ApiCreateMoverProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '[mover] 프로필 생성',
      description: `
- [mover]가 처음 프로필을 등록할 때 사용하는 API입니다.
- 별명, 경력, 한 줄소개, 상세 설명, 서비스 유형, 서비스 지역은 필수입니다.
- imageUrl은 선택 항목입니다.
      `,
    }),
    ApiBody({
      type: CreateMoverProfileDto,
      examples: {
        fullExample: CreateMoverProfileFullExample,
      },
    }),
    ApiResponse(
      CODE_201_CREATED({
        description: '[mover] 프로필 생성 성공',
        schema: MessageSchema('기사님의 프로필이 성공적으로 생성되었습니다.'),
      }),
    ),
    ApiResponse(
      CODE_400_BAD_REQUEST([
        nicknameValidationError,
        imageUrlValidationError,
        experienceValidationError,
        introValidationError,
        descriptionValidationError,
        serviceTypeValidationError,
        serviceRegionValidationError,
      ]),
    ),
    ApiResponse(CODE_401_RESPONSES),
  );

export function ApiUpdateMyMoverProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '나의 [mover] 프로필 수정',
      description: `
- 나의 [mover] 프로필을 수정하는 API입니다.
- 모든 필드는 선택적으로 수정 가능합니다.
      `,
    }),
    ApiBody({
      description:
        '수정할 필드 (별명, 프로필 이미지 URL, 경력, 한 줄 소개, 상세 설명, 서비스 유형, 서비스 지역)를 포함합니다.',
      type: UpdateMoverProfileDto,
      examples: {
        fullExample: UpdateMoverProfileFullExample,
      },
    }),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '본인의 [mover] 프로필 수정 성공한 경우',
        schema: MessageSchema('기사님의 프로필이 성공적으로 수정되었습니다.'),
      }),
    ),
    ApiResponse(
      CODE_400_BAD_REQUEST([
        nicknameValidationError,
        imageUrlValidationError,
        experienceValidationError,
        introValidationError,
        descriptionValidationError,
        serviceTypeValidationError,
        serviceRegionValidationError,
      ]),
    ),
    ApiResponse(CODE_401_RESPONSES),
  );
}

export const ApiGetMoverProfiles = () =>
  applyDecorators(
    ApiOperation({
      summary: '[mover] 프로필 목록 조회',
      description: `
- 필터링된 [mover] 프로필 리스트를 커서 기반 페이지네이션 방식으로 조회합니다.
- order 필드를 통해 정렬할 수 있으며 필수입니다
- order 필드는 'review_count', 'average_rating', 'experience', 'confirmed_estimate_count' 중 하나를 선택할 수 있습니다.
- order 방향은 'ASC' 또는 'DESC'로 지정할 수 있습니다.
- take는 옵션이며 기본적으로 5개 입니다.
- serviceType 및 serviceRegion은 최소 하나 이상의 true 값을 포함해야 합니다.
- serviceType 및 serviceRegion은 기본적으로 전체 true 값으로 요청할 수 있습니다.
      `,
    }),
    ApiQuery(cursorQuery),
    ApiQuery(orderQuery),
    ApiQuery(takeQuery),
    ApiQuery(serviceTypeQuery),
    ApiQuery(serviceRegionQuery),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '[mover] 프로필 목록 조회 성공',
        schema: MoverProfileListSchema,
      }),
    ),
    ApiResponse(
      CODE_400_BAD_REQUEST([
        cursorValidationError,
        orderValidationError,
        takeValidationError,
        serviceTypeValidationError,
        serviceRegionValidationError,
      ]),
    ),
  );

export function ApiGetMyMoverProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '나의 [mover] 프로필 조회',
      description: `
- 나의 [mover] 프로필을 조회합니다.
- 회원가입 및 로그인 후, [mover] 프로필을 등록했다면 이 API로 조회할 수 있습니다.
      `,
    }),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '본인의 [mover] 프로필 조회 성공한 경우',
        schema: MoverProfileDetailSchema,
      }),
    ),
    ApiResponse(CODE_401_RESPONSES),
    ApiResponse(CODE_404_NOT_FOUND([moverProfileNotFoundError])),
  );
}

export function ApiGetMoverProfileById() {
  return applyDecorators(
    ApiOperation({
      summary: '[mover] 특정 프로필 조회',
      description: `
- 특정 기사님의 [mover] 프로필 상세 정보를 조회합니다.
- 리뷰 정보, 통계 데이터 (리뷰 수, 평점, 확정된 견적 수, 좋아요 수)와 함께 반환됩니다.`,
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: '조회할 [mover]의 프로필 ID',
      example: '8a12f8b9-1e4b-49f2-8302-4c5c8cbcb488',
    }),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '[mover] 프로필 조회 성공',
        schema: MoverProfileDetailSchema,
      }),
    ),
    ApiResponse(CODE_401_RESPONSES),
    ApiResponse(CODE_404_NOT_FOUND([moverProfileNotFoundError])),
  );
}
