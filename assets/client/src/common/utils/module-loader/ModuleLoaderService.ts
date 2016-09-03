import {ReflectiveInjector, ComponentFactoryResolver, ModuleWithComponentFactories, ComponentFactory, ViewContainerRef, Type, ComponentRef, ResolvedReflectiveProvider} from '@angular/core';
import {RuntimeCompiler} from '@angular/compiler';
import {Injectable} from '@angular/core';

@Injectable()
export class ModuleLoaderService {

    constructor(private _runtimeCompiler: RuntimeCompiler,
        private _componentFactoryResolver: ComponentFactoryResolver) { }

    public loadNextToLocation(moduleTypeToInject: Type<any>, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]): Promise<ComponentRef<any>> {
        return new Promise<ComponentRef<any>>((resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void }) => {
            this.loadNextToLocationCore(resolve, reject, moduleTypeToInject, viewContainerRef, providers);
        });
    }
    private loadNextToLocationCore(resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void },
        moduleTypeToInject: Type<any>, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]) {
        this._runtimeCompiler.compileModuleAndAllComponentsAsync(moduleTypeToInject).then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
            if (moduleWithFactories.componentFactories.length == 0 || moduleWithFactories.componentFactories.length > 1) {
                reject(new Error("The module should only export one root component for the modal"));
            }
            let componentFactory: ComponentFactory<any> = moduleWithFactories.componentFactories[0];
            let lastViewIndex = viewContainerRef.length;
            let childProviders = ReflectiveInjector.fromResolvedProviders(providers, viewContainerRef.injector);
            let componentRef: ComponentRef<any> = viewContainerRef.createComponent(componentFactory, lastViewIndex, childProviders);
            resolve(componentRef);
        }).catch((e) => {
            reject(e);
        });
    }
}