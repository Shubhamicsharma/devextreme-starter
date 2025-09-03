import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDrawerModule, DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import {
    DxScrollViewModule,
    DxScrollViewComponent,
} from 'devextreme-angular/ui/scroll-view';

import {
    SideNavigationMenuComponent,
    HeaderComponent,
} from '../../shared/components';
import { ScreenService, ThemeService } from '../../shared/services';

@Component({
    selector: 'app-side-nav-outer-toolbar',
    templateUrl: './side-nav-outer-toolbar.component.html',
    styleUrls: ['./side-nav-outer-toolbar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SideNavigationMenuComponent,
        DxDrawerModule,
        HeaderComponent,
        DxScrollViewModule,
    ],
})
export class SideNavOuterToolbarComponent implements OnInit, AfterViewInit {
    @ViewChild(DxScrollViewComponent, { static: true })
    scrollView!: DxScrollViewComponent;
    selectedRoute = '';

    menuOpened!: boolean;
    temporaryMenuOpened = false;

    @Input()
    title!: string;

    menuMode: DxDrawerTypes.OpenedStateMode = 'shrink';
    menuRevealMode: DxDrawerTypes.RevealMode = 'expand';
    minMenuSize = 0;
    shaderEnabled = false;
    swatchClassName = 'dx-swatch-additional';

    constructor(
        protected themeService: ThemeService,
        private screen: ScreenService,
        private router: Router
    ) {
        themeService.isDark.subscribe((isDark) => {
            this.swatchClassName =
                'dx-swatch-additional' + (isDark ? '-dark' : '');
        });
    }

    ngOnInit() {
        this.menuOpened = this.screen.sizes['screen-large'];

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.selectedRoute = val.urlAfterRedirects.split('?')[0];
            }
        });

        this.screen.changed.subscribe(() => this.updateDrawer());

        this.updateDrawer();
    }

    ngAfterViewInit() {
        // Trigger a screen resize to force layout recalculation
        setTimeout(() => {
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            // Temporarily resize by 1px
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: originalWidth - 1,
            });

            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: originalHeight - 1,
            });

            // Dispatch resize event
            window.dispatchEvent(new Event('resize'));

            // Restore original size immediately
            setTimeout(() => {
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: originalWidth,
                });

                Object.defineProperty(window, 'innerHeight', {
                    writable: true,
                    configurable: true,
                    value: originalHeight,
                });

                // Dispatch final resize event
                window.dispatchEvent(new Event('resize'));
            }, 1);
        }, 100);
    }

    updateDrawer() {
        const isXSmall = this.screen.sizes['screen-x-small'];
        const isLarge = this.screen.sizes['screen-large'];

        this.menuMode = isLarge ? 'shrink' : 'overlap';
        this.menuRevealMode = isXSmall ? 'slide' : 'expand';
        this.minMenuSize = isXSmall ? 0 : 60;
        this.shaderEnabled = !isLarge;
    }

    get hideMenuAfterNavigation() {
        return this.menuMode === 'overlap' || this.temporaryMenuOpened;
    }

    get showMenuAfterClick() {
        return !this.menuOpened;
    }

    navigationChanged(event: DxTreeViewTypes.ItemClickEvent) {
        const path = (event.itemData as any).path;
        const pointerEvent = event.event;

        if (path && this.menuOpened) {
            if (event.node?.selected) {
                pointerEvent?.preventDefault();
            } else {
                this.router.navigate([path]);
                this.scrollView.instance.scrollTo(0);
            }

            if (this.hideMenuAfterNavigation) {
                this.temporaryMenuOpened = false;
                this.menuOpened = false;
                pointerEvent?.stopPropagation();
            }
        } else {
            pointerEvent?.preventDefault();
        }
    }

    navigationClick() {
        if (this.showMenuAfterClick) {
            this.temporaryMenuOpened = true;
            this.menuOpened = true;
        }
    }
}
