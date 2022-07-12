import { Body, Controller, Post, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator'
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApprovedReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';


@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
        return this.reportsService.changeApproval(parseInt(id), body.approved);
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        console.log(query);
    }

}
