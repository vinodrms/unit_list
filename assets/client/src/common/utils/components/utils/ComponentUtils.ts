import {ReflectiveInjector, ComponentResolver, ComponentFactory, ViewContainerRef, Type, ComponentRef, ResolvedReflectiveProvider} from '@angular/core';

export class ComponentUtils {
    constructor(private _componentResolver: ComponentResolver) { }

    public loadNextToLocation(componentType: Type, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]): Promise<ComponentRef<any>> {
        return new Promise<ComponentRef<any>>((resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void }) => {
            this.loadNextToLocationCore(resolve, reject, componentType, viewContainerRef, providers);
        });
    }
    private loadNextToLocationCore(resolve: { (result: ComponentRef<any>): void }, reject: { (err: any): void },
        componentType: Type, viewContainerRef: ViewContainerRef, providers: ResolvedReflectiveProvider[]) {
        this._componentResolver.resolveComponent(componentType)
            .then((componentFactory: ComponentFactory<any>) => {
                let lastViewIndex = viewContainerRef.length;
                let childProviders = ReflectiveInjector.fromResolvedProviders(providers, viewContainerRef.injector);
                return viewContainerRef.createComponent(componentFactory, lastViewIndex, childProviders);
            }).then((componentRef: ComponentRef<any>) => {
                componentRef.changeDetectorRef.detectChanges();
                resolve(componentRef);
            }).catch((err: Error) => {
                reject(err)
            });
    }
}