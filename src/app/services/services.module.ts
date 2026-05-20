import { NgModule } from "@angular/core";
import { ConfigService } from "./config.service";
import { ApiService } from "./api.service";
import { HttpClientModule } from "@angular/common/http";
import { FeaturesService } from "./features.service";
import { ThemesService } from "./themes.service";
import { TranslateService } from "./translate.service";
import { LoaderService } from "./loader.service";
import { AuthService } from "./auth.service";
import { MushroomsService } from "./mushrooms.service";
import { UtilsService } from "./utils.service";

@NgModule({
    imports: [HttpClientModule],
    providers: [
        ConfigService,
        ApiService,
        FeaturesService,
        ThemesService,
        TranslateService,
        LoaderService,
        AuthService,
        MushroomsService,
        UtilsService
    ]
})
export class ServicesModule {}