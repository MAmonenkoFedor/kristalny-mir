import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

/** Публичные эндпоинты — отдают контент для сайта. */
@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('site')
  site() {
    return this.content.getSite();
  }

  @Get('services')
  services() {
    return this.content.listServices();
  }

  @Get('gallery')
  gallery() {
    return this.content.listGallery();
  }

  @Get('posts')
  posts() {
    return this.content.listPosts(false);
  }

  @Get('posts/:slug')
  post(@Param('slug') slug: string) {
    return this.content.getPost(slug);
  }
}
