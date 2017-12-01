import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";
import { MultiLanguageService } from "@app/core/services";
import { DataServiceConfig } from "@app/core/abstract";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [HttpClientModule],
    declarations: [],
    exports: [],
    providers: [
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: DataServiceConfig): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                { provide: DataServiceConfig, useValue: config },
                { provide: MultiLanguageService, useClass: MultiLanguageService }
            ]
        };
    }
}