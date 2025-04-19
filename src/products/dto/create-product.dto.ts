import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString() //Valida que el valor siempre sea en String
    public name: string;
    @IsNumber({
        maxDecimalPlaces: 4, //Valida que el valor sea Number o Numerico
    })
    @Min(0) //El valor minimo sera 0
    @Type(() => Number) //Tranforma el valor enviado por el post y lo transforma en numero
    public price: number;

}
