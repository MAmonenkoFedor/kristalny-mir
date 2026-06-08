import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/** Защищённые эндпоинты редактирования контента (нужен JWT). */
@UseGuards(JwtAuthGuard)
@Controller('admin/content')
export class AdminContentController {
  constructor(private readonly content: ContentService) {}

  // SITE
  @Put('site')
  setSite(@Body() body: Record<string, any>) {
    return this.content.setSite(body);
  }

  // SERVICES
  @Post('services')
  createService(@Body() body: Record<string, any>) {
    return this.content.createService(body);
  }
  @Put('services/:id')
  updateService(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.content.updateService(id, body);
  }
  @Delete('services/:id')
  deleteService(@Param('id') id: string) {
    return this.content.deleteService(id);
  }

  // GALLERY
  @Post('gallery')
  createGallery(@Body() body: Record<string, any>) {
    return this.content.createGallery(body);
  }
  @Put('gallery/:id')
  updateGallery(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.content.updateGallery(id, body);
  }
  @Delete('gallery/:id')
  deleteGallery(@Param('id') id: string) {
    return this.content.deleteGallery(id);
  }

  // POSTS
  @Get('posts')
  allPosts() {
    return this.content.listPosts(true);
  }
  @Post('posts')
  createPost(@Body() body: Record<string, any>) {
    return this.content.createPost(body);
  }
  @Put('posts/:id')
  updatePost(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.content.updatePost(id, body);
  }
  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.content.deletePost(id);
  }
}
