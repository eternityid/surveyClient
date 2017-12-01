import { Route, Routes } from "@angular/router";


export interface AppRoutes {
    default: Route;
    dashboards: Route;
    analyze: Route;
    reports: Route;
}

export const appRoutes: AppRoutes = {
    default: { path: '', redirectTo: 'analyze', pathMatch: 'full' },
    dashboards: { path: 'dashboards', loadChildren: 'app/analyze/analyze.module#AnalyzeModule' },
    analyze: { path: 'analyze', loadChildren: 'app/analyze/analyze.module#AnalyzeModule' },
    reports: { path: 'reports', loadChildren: 'app/analyze/analyze.module#AnalyzeModule' }
};

export const appRouteList: Routes = [
    appRoutes.default,
    appRoutes.dashboards,
    appRoutes.analyze,
    appRoutes.reports
];