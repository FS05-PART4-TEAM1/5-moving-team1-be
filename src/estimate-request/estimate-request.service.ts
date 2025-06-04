import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstimateRequestDto } from './dto/create-estimate-request.dto';
import { UpdateEstimateRequestDto } from './dto/update-estimate-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EstimateRequest,
  RequestStatus,
} from './entities/estimate-request.entity';
import { CustomerProfile } from '@/customer-profile/entities/customer-profile.entity';
import { Repository } from 'typeorm';
import { UserInfo } from '@/user/decorator/user-info.decorator';
import { plainToInstance } from 'class-transformer';
import { EstimateRequestResponseDto } from './dto/estimate-request-response.dto';
import { EstimateRequestSummaryDto } from './dto/estimate-request-summary.dto';
@Injectable()
export class EstimateRequestService {
  constructor(
    @InjectRepository(EstimateRequest)
    private readonly estimateRequestRepository: Repository<EstimateRequest>,
    @InjectRepository(CustomerProfile)
    private readonly customerProfileRepository: Repository<CustomerProfile>,
  ) {}
  /**
   * 견적 요청 생성
   * @param dto - 견적 요청 정보
   * @param user - 현재 로그인한 유저 정보
   * @returns 생성된 견적 요청 정보
   * @throws NotFoundException - 고객 프로필을 찾을 수 없는 경우
   */
  async create(dto: CreateEstimateRequestDto, user: UserInfo) {
    // 1. 로그인한 유저의 CustomerProfile 가져오기
    const customer = await this.customerProfileRepository.findOne({
      where: { user: { id: user.sub } },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException('고객 프로필을 찾을 수 없습니다.');
    }
    //TODO: 현재 유저가 진행 중인 견적 요청이 있는지 확인하는 로직 추가 필요
    //이미 PENDING, CONFIRMED, CANCELED 상태의 견적 요청을 가지고 있다면, 새로운 요청 생성 불가
    //COMPLETED 또는 EXPIRED 상태인 경우에만 새로운 요청 생성 가능

    // 2. EstimateRequest 인스턴스 생성
    const estimate = this.estimateRequestRepository.create({
      moveType: dto.moveType,
      moveDate: new Date(dto.moveDate),
      fromAddress: dto.fromAddress,
      toAddress: dto.toAddress,
      customer,
    });

    // 3. 저장
    const saved = await this.estimateRequestRepository.save(estimate);
    const withRelations = await this.estimateRequestRepository.findOne({
      where: { id: saved.id },
      relations: ['customer', 'customer.user'],
    });

    return {
      message: '견적 요청이 성공적으로 생성되었습니다.',
      id: saved.id,
    };
  }

  /**
   * 현재 로그인한 유저의 모든 견적 요청을 조회
   * @param userId - 현재 로그인한 유저의 ID
   * @returns 견적 요청 목록 (EstimateRequestSummaryDto 배열)
   */
  async findMyRequests(userId: string) {
    const requests = await this.estimateRequestRepository.find({
      where: { customer: { user: { id: userId } } },
      relations: ['customer', 'customer.user'],
      order: { createdAt: 'DESC' },
    });
    //결과가 없을 때는 빈 배열([]) 반환
    return plainToInstance(EstimateRequestSummaryDto, requests, {
      excludeExtraneousValues: true,
    });
  }
  /**
   * 내 견적 요청을 ID로 조회
   * @param id - 견적 요청 ID
   * @param userId - 현재 로그인한 유저의 ID
   * @returns 견적 요청 정보
   * @throws NotFoundException - 요청이 없거나 접근 권한이 없는 경우
   */
  async findMyRequestById(id: string, userId: string) {
    const request = await this.estimateRequestRepository.findOne({
      where: { id },
      relations: ['customer', 'customer.user'],
    });

    if (!request) {
      throw new NotFoundException('견적 요청을 찾을 수 없습니다.');
    }

    if (request.customer.user.id !== userId) {
      // 사용자가 다른 사람의 견적 ID로 접근했을 때 (원래는 없어야 함)
      // 견적이 존재하는지에 대한 정보 주지 않기 위해 404 처리
      // throw new NotFoundException('견적 요청을 찾을 수 없습니다.');
      //개발 중 로깅 위해 다르게 처리 TODO: 나중에 제거
      throw new ForbiddenException('본인의 견적 요청만 조회할 수 있습니다.');
    }

    return plainToInstance(EstimateRequestResponseDto, request, {
      excludeExtraneousValues: true,
    });
  }

  update(id: number, updateEstimateRequestDto: UpdateEstimateRequestDto) {
    return `This action updates a #${id} estimateRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} estimateRequest`;
  }
}
