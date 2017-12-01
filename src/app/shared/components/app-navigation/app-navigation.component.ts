import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { Dictionary } from "lodash";
import { ArrayUtil, ObjectUtil } from "@app/core/utils";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { appRoutes } from "@app/shared/shared.app-routes";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navigation',
    templateUrl: './app-navigation.component.html',
    styleUrls: ['./app-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavigationComponent implements OnInit {

    constructor(private router: Router) {
        let routeName = this.router.url.startsWith('/') ? this.router.url.substr(1) : this.router.url;
        this.vm = new AppNavigationUi(routeName);
    }

    public vm: AppNavigationUi;

    private initiated: boolean = false;

    ngOnInit(): void {
        this.initiated = true;
    }

    private onItemMouseEnter($event: any, item: AppNavigationItemUi) {
        item.isHovering = true;
    }

    private onItemMouseLeave($event: any, item: AppNavigationItemUi) {
        item.isHovering = false;
    }
}

export class AppNavigationItemUi {
    constructor(routerName: string | undefined, translateKey: string, iconClass: string, activated?: boolean) {
        this.routerName = routerName ? routerName : '';
        this.routerLink = '/' + routerName;
        this.translateKey = translateKey;
        this.iconClass = iconClass;
        this.activated = activated ? activated : false;
    }

    public routerName: string;
    public routerLink: string;
    public translateKey: string;
    public activated: boolean;
    public iconClass: string;
    public isHovering: boolean;
}

export class AppNavigationUi {
    constructor(activatedRouteName: string) {
        this.activatedRouteName = activatedRouteName;
        this.items = [
            new AppNavigationItemUi(appRoutes.dashboards.path, 'SHARED.APP_NAVIGATION.DASHBOARDS', 'dashboards-icon-sm'),
            new AppNavigationItemUi(appRoutes.analyze.path, 'SHARED.APP_NAVIGATION.ANALYZE', 'analyze-icon-sm'),
            new AppNavigationItemUi(appRoutes.reports.path, 'SHARED.APP_NAVIGATION.REPORTS', 'reports-icon-sm')
        ];
        this.setActivatedItem();
    }

    public items: AppNavigationItemUi[];
    public activatedRouteName: string;

    public setActivatedItem() {
        this.items.forEach(item => {
            item.activated = item.routerName == this.activatedRouteName;
        });
    }

    public isHighlightItem(item: AppNavigationItemUi) {
        if (item.isHovering) return true;
        if (item.activated) {
            let anyOtherItemsHovering = ArrayUtil.any(this.items, x => x.isHovering && x != item);
            if (!anyOtherItemsHovering) return true;
        }
        return false;
    }
}

export interface AppNavigationRoutesUi extends Dictionary<AppNavigationItemUi> {
    dashboards: AppNavigationItemUi;
    analyze: AppNavigationItemUi;
    reports: AppNavigationItemUi;
}