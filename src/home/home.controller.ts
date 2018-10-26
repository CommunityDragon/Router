import { Get, Controller, Res } from '@nestjs/common';

@Controller()
export class HomeController {

  @Get()
  getHomepage(@Res() res) {
    res.render('index');
  }
}
