import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        AutomapperModule.forRoot({
            options: [
                {
                    name: "classes",
                    pluginInitializer: classes,
                }
            ],
            singular: true,
        }),
    ],
})
export class AutoMapperModule { }