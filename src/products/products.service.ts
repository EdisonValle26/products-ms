import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
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
    const totalPages = await this.product.count({where: {
      available: true
    }});

    //Permite saber cual es la ultima pagina que tenemos  
    const lastPage = Math.ceil(totalPages / limit);

    //Usamos BadRequestException para enviar una respuesta de error al cliente
    if (totalPages > 0 && page > lastPage) {
      throw new BadRequestException(`El máximo de páginas es ${lastPage}`);
    }

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if(!product)
      throw new NotFoundException(`El producto con el id #${id} no se encuentra.`);

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    return this.product.update({
      where: {id},
      data: updateProductDto,
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: {id},
      data: {
        available : false
      }
    });

    if (!product || !product.available) {
      this.logger.warn(`Producto con id ${id} no encontrado o ya eliminado.`);
      throw new NotFoundException(`El producto con el id #${id} no se encuentra o ya fue eliminado.`);
    }

    return product
  }
}
