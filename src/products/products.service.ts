import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{
  //Se utiliza para los log que estan al iniciar la app
  private readonly logger = new Logger("ProductsService");
  
  //Inicializa la conneccion con la base de datos
  onModuleInit() {
    this.$connect();
    this.logger.log("Database connected");
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    //Permite saber el numero total de paginas que tenemos
    const totalPages = await this.product.count();

    //Permite saber cual es la ultima pagina que tenemos  
    const lastPage = Math.ceil(totalPages / limit);

    //Usamos BadRequestException para enviar una respuesta de error al cliente
    if (totalPages > 0 && page > lastPage) {
      throw new BadRequestException(`El máximo de páginas es ${lastPage}`);
    }

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }
  }

  findOne(id: number) {
    console.log("object");
    return this.product.findUnique({
      where: {id}
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
