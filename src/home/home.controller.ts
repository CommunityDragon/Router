import { Get, Controller, Res } from '@nestjs/common';
var path = require("path");

@Controller()
export class HomeController {
  
  @Get()
  getHomepage(@Res() res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  }
}
