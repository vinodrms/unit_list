import {ReflectiveInjector, ComponentFactoryResolver, ModuleWithComponentFactories, ComponentFactory, ViewContainerRef, Type, ComponentRef, ResolvedReflectiveProvider} from '@angular/core';
import {Injectable, Compiler} from '@angular/core';
import {ThUtils} from '../ThUtils';

@Injectable()
export class ModuleLoaderService {
    private _thUtils: ThUtils;

    constructor(private _compiler: Compiler,
        private _componentFactoryResolver: ComponentFactoryResolver) {
        this._thUtils = new ThUtils();
    }

    public loadNextToLocation(moduleTypeToInject: Type<any>, componentTypeToInject: Type<any>, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]): Promise<ComponentRef<any>> {
        return new Promise<ComponentRef<any>>((resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void }) => {
            this.loadNextToLocationCore(resolve, reject, moduleTypeToInject, componentTypeToInject, viewContainerRef, providers);
        });
    }
    private loadNextToLocationCore(resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void },
        moduleTypeToInject: Type<any>, componentTypeToInject: Type<any>, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]) {
        this._compiler.compileModuleAndAllComponentsAsync(moduleTypeToInject).then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
            let componentFactory: ComponentFactory<any> = _.find(moduleWithFactories.componentFactories, (factory: ComponentFactory<any>) => {
                return factory.componentType === componentTypeToInject;
            });
            if(this._thUtils.isUndefinedOrNull(componentFactory)) {
                reject(new Error("Component to inject in module was not found"));
                return;
            }
            let lastViewIndex = viewContainerRef.length;
            let childProviders = ReflectiveInjector.fromResolvedProviders(providers, viewContainerRef.injector);
            let componentRef: ComponentRef<any> = viewContainerRef.createComponent(componentFactory, lastViewIndex, childProviders);
            resolve(componentRef);
        }).catch((e) => {
            reject(e);
        });
    }
}