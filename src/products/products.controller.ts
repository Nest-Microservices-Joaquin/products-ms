import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' }) // lo que pongamos en messagePattern se utilizara para llamar a nuestro microservicio desde otro microservicio.
  create(@Payload() createProductDto: CreateProductDto) { // Ahora rescataremos toda la info ya sea desde el body, query, param, etc desde el decorador @Payload
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all' })
  findAll( @Payload() paginationDto: PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }

  @MessagePattern({ cmd: 'find_one' })
  findOne(@Payload('id', ParseIntPipe ) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) { // para recibir el id añadimos la propiedad "id" en updateProductDto
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_product' })
  validateProducts(@Payload() ids: number[]){
    return this.productsService.validateProducts(ids)
  }
}
