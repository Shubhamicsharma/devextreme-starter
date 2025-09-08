import {
    Component,
    Output,
    Input,
    EventEmitter,
    ElementRef,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { navigation } from '../../../app-navigation';
import * as events from 'devextreme-angular/common/core/events';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-side-navigation-menu',
    templateUrl: './side-navigation-menu.component.html',
    styleUrls: ['./side-navigation-menu.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy {
    // Logo Url
    logoUrl: string = 'assets/images/logo/rv-capital-logo.svg';

    selectedIndex: number = -1;
    selectedPath: string = '';
    selectionIndicatorPosition: number = 0;

    @Output()
    selectedItemChanged = new EventEmitter<any>();

    @Output()
    openMenu = new EventEmitter<any>();

    private _selectedItem!: string;
    @Input()
    set selectedItem(value: string) {
        this._selectedItem = value;
        this.selectedPath = value;
        this.updateSelection();
    }

    private _items!: Record<string, unknown>[];
    get items() {
        if (!this._items) {
            this._items = navigation.map((item) => {
                if (item.path && !/^\//.test(item.path)) {
                    item.path = `/${item.path}`;
                }
                return { ...item, expanded: !this._compactMode };
            });
        }
        return this._items;
    }

    _compactMode = false;
    @Input()
    get compactMode() {
        return this._compactMode;
    }
    set compactMode(val) {
        this._compactMode = val;

        // If compact mode is on, show small logo, else show large logo
        if (this._compactMode) {
            this.logoUrl = 'assets/images/logo/rv-logo-small.png';
        } else {
            this.logoUrl = 'assets/images/logo/rv-capital-logo.svg';
        }

        // Update expansion state
        this._items = this.items.map((item) => ({ ...item, expanded: !val }));
    }

    constructor(private elementRef: ElementRef, private router: Router) {}

    getIconClass(icon: string): string {
        // If it's already a Font Awesome class, return as is
        if (
            icon &&
            (icon.includes('fas') ||
                icon.includes('far') ||
                icon.includes('fab'))
        ) {
            return icon;
        }

        // Map DevExtreme icons to Font Awesome
        const iconMap: { [key: string]: string } = {
            preferences: 'fas fa-cog',
            user: 'fas fa-user',
            check: 'fas fa-check',
            home: 'fas fa-home',
            folder: 'fas fa-folder',
            edit: 'fas fa-edit',
            save: 'fas fa-save',
            remove: 'fas fa-trash',
        };

        return iconMap[icon] || icon || 'fas fa-circle';
    }

    onNavItemClick(item: any, index: number): void {
        if (item.items && item.items.length > 0) {
            // Toggle expansion for parent items
            item.expanded = !item.expanded;
            this.selectedIndex = index;
            this.updateSelectionIndicator();
        } else if (item.path) {
            // Navigate for leaf items
            this.selectedIndex = index;
            this.selectedPath = item.path;
            this.updateSelectionIndicator();
            this.selectedItemChanged.emit({
                itemData: item,
                node: { selected: this.selectedPath === item.path },
                event: null,
            });
            this.router.navigate([item.path]);
        }
    }

    onChildItemClick(child: any, event: Event): void {
        event.stopPropagation();
        if (child.path) {
            this.selectedPath = child.path;

            // Find the parent index to keep the selection indicator on the parent
            this.items.forEach((item: any, index) => {
                if (
                    item.items &&
                    item.items.some((c: any) => c.path === child.path)
                ) {
                    this.selectedIndex = index;
                    item.expanded = true; // Ensure parent stays expanded
                    this.updateSelectionIndicator();
                }
            });

            this.selectedItemChanged.emit({
                itemData: child,
                node: { selected: true },
                event: event,
            });
            this.router.navigate([child.path]);
        }
    }

    private updateSelection(): void {
        // Find the selected item and update the index
        let foundIndex = -1;

        this.items.forEach((item: any, index) => {
            if (item.path === this.selectedPath) {
                foundIndex = index;
            } else if (item.items) {
                const childFound = item.items.some(
                    (child: any) => child.path === this.selectedPath
                );
                if (childFound) {
                    foundIndex = index;
                    item.expanded = true; // Expand parent if child is selected
                }
            }
        });

        if (foundIndex !== -1) {
            this.selectedIndex = foundIndex;
            this.updateSelectionIndicator();
        }
    }

    private updateSelectionIndicator(): void {
        // Calculate the position based on the actual height and position
        const itemHeight = 48; // Each nav item is 48px

        // If no item is selected, hide the indicator
        if (this.selectedIndex < 0) {
            this.selectionIndicatorPosition = -100; // Move off screen
            return;
        }

        // Calculate position: multiply by item height for smooth sliding
        this.selectionIndicatorPosition = this.selectedIndex * itemHeight;
    }

    ngAfterViewInit() {
        events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
            this.openMenu.next(e);
        });

        // Initialize selection
        this.updateSelection();
    }

    ngOnDestroy() {
        events.off(this.elementRef.nativeElement, 'dxclick');
    }
}
