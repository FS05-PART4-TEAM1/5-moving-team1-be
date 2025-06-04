import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  applyDecorators,
} from '@nestjs/common';
import { EstimateRequestService } from '@/estimate-request/estimate-request.service';
import { CreateEstimateRequestDto } from '@/estimate-request/dto/create-estimate-request.dto';
import { EstimateRequestResponseDto } from '@/estimate-request/dto/estimate-request-response.dto';
import { UserInfo } from '@/user/decorator/user-info.decorator';
import {
  CODE_201_CREATED,
  CODE_200_SUCCESS,
  CODE_400_BAD_REQUEST,
  CODE_401_RESPONSES,
  CODE_404_NOT_FOUND,
} from '@/common/docs/response.swagger';

export function ApiCreateEstimateRequest() {
  return applyDecorators(
    ApiOperation({
      summary: '견적 요청 생성',
      description: '고객이 새로운 견적 요청을 생성합니다.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: CreateEstimateRequestDto,
      examples: {
        basic: {
          summary: '기본 예시',
          value: {
            moveType: 'HOME',
            moveDate: '2025-07-15',
            fromAddress: {
              sido: '경기',
              sidoEnglish: 'Gyeonggi',
              sigungu: '성남시 분당구',
              roadAddress: '불정로 6',
              fullAddress: '경기 성남시 분당구 불정로 6',
            },
            toAddress: {
              sido: '서울',
              sidoEnglish: 'Seoul',
              sigungu: '강남구',
              roadAddress: '테헤란로 212',
              fullAddress: '서울 강남구 테헤란로 212',
            },
            targetMoverIds: ['a1b2c3d4-e5f6-7890-1234-56789abcdeff'],
          },
        },
      },
    }),
    ApiResponse(
      CODE_201_CREATED({
        description: '견적 요청 생성 성공',
        schema: { example: EstimateRequestResponseDto },
      }),
    ),
    ApiResponse(CODE_400_BAD_REQUEST([])),
    ApiResponse(CODE_401_RESPONSES),
  );
}
// 내 견적 요청 목록 조회 API
export function ApiFindMyEstimateRequests() {
  return applyDecorators(
    ApiOperation({
      summary: '내 견적 요청 목록 조회',
      description: '로그인한 사용자의 모든 견적 요청을 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '견적 요청 목록 조회 성공',
        schema: {
          example: [
            {
              id: '1c340ecf-e7f8-4431-bad2-dc19ea9ff3e7',
              moveType: 'HOME',
              status: 'PENDING',
              moveDate: '2025-07-15T00:00:00.000Z',
              fromAddress: {
                sido: '서울',
                sidoEnglish: 'Seoul',
                sigungu: '서울시 중구',
                roadAddress: '을지로 11길',
                fullAddress: '서울시 중구 을지로 11길',
              },
              toAddress: {
                sido: '서울',
                sidoEnglish: 'Seoul',
                sigungu: '강남구',
                roadAddress: '테헤란로 212',
                fullAddress: '서울 강남구 테헤란로 212',
              },
            },
            // ... 목록
          ],
        },
      }),
    ),
    ApiResponse(CODE_401_RESPONSES),
  );
}

//견적 요청 상세 조회 API
export function ApiFindEstimateRequestById() {
  return applyDecorators(
    ApiOperation({
      summary: '내 견적 요청 상세 조회',
      description: '특정 견적 요청의 상세 정보를 조회합니다.',
    }),
    ApiBearerAuth(),
    ApiResponse(
      CODE_200_SUCCESS({
        description: '견적 요청 상세 조회 성공',
        schema: {
          example: [
            {
              id: '1c340ecf-e7f8-4431-bad2-dc19ea9ff3e7',
              moveType: 'HOME',
              status: 'PENDING',
              moveDate: '2025-07-15T00:00:00.000Z',
              fromAddress: {
                sido: '서울',
                sidoEnglish: 'Seoul',
                sigungu: '서울시 중구',
                roadAddress: '을지로 11길',
                fullAddress: '서울시 중구 을지로 11길',
              },
              toAddress: {
                sido: '서울',
                sidoEnglish: 'Seoul',
                sigungu: '강남구',
                roadAddress: '테헤란로 212',
                fullAddress: '서울 강남구 테헤란로 212',
              },
            },
            {
              id: '...',
              moveType: '...',
              status: '...',
              moveDate: '...',
              fromAddress: {
                sido: '...',
                sidoEnglish: '...',
                sigungu: '...',
                roadAddress: '...',
                fullAddress: '...',
              },
              toAddress: {
                sido: '...',
                sidoEnglish: '...',
                sigungu: '...',
                roadAddress: '...',
                fullAddress: '...',
              },
            },
          ],
        },
      }),
    ),
    ApiResponse(CODE_401_RESPONSES),
    ApiResponse(
      CODE_404_NOT_FOUND({
        description: '견적 요청 없음',
        message: '해당 견적 요청을 찾을 수 없습니다.',
      }),
    ),
  );
}
