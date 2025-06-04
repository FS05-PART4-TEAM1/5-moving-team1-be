import { PickType } from '@nestjs/swagger';
import { EstimateRequestResponseDto } from './estimate-request-response.dto';

export class EstimateRequestSummaryDto extends PickType(
  EstimateRequestResponseDto,
  ['id', 'moveType', 'status', 'moveDate', 'fromAddress', 'toAddress'],
) {}
