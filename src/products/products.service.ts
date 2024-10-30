import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService') // logger nos ayuda a mejorar los mensajes en la consola.

  onModuleInit() {
    this.$connect(); // Esto genera la conexion con la DB
    this.logger.log('Database Connected')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll( paginationDto: PaginationDto ) {
    
    const { limit, page } = paginationDto

    const totalPages = await this.product.count({ where : { available : true }}) // el total de registros en nuestra DB.
    const lastPage = Math.ceil( totalPages / limit ) // el total de paginas segun el limit.

    return {
      data: await this.product.findMany({
        skip: ( page - 1 ) * limit, // Aqui se hace la paginacion.
        take: limit, // limite de registros a mostrar por pagina.
        where: { available : true }
      }),
      meta: {
        total: totalPages, // total de registros.
        page: page, // pagina en la que nos encontramos.
        lastPage: lastPage // total de paginas.
      }
    }

  }

  async findOne(id: number) {
    
    const product = await this.product.findFirst({
      where: { id, available: true }
    })

    if( !product ){
      throw new NotFoundException(`Product with id #${id} not found.`)
    }

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id:__, ...data } = updateProductDto

    await this.findOne( id )

    return this.product.update({
      where: { id },
      data: data
    })
  }

  async remove(id: number) { // Hacemos uso de un soft delete. Esto quiere decir que no borramos completamente el registro, sino que creamos una nueva columna que nos informa si el registro esta disponible o no.

    await this.findOne( id )

    const product = await this.product.update({
      where : { id },
      data: {
        available : false
      }
    })

    return product

  }
}
