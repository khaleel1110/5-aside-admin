import {Component, inject} from '@angular/core';
import { RouterLink,  RouterOutlet} from "@angular/router";
import {NgProgressComponent} from 'ngx-progressbar';
import {SideBarNavigationItemComponent} from './side-bar-navigation-item/side-bar-navigation-item.component';
import {SideNavigationData, SideNavigationFooter} from './side-navigation';
import {MenuComponent} from './menu/menu.component';
import {AsideUserFooterComponent} from './aside-user-footer/aside-user-footer.component';
import {Location, NgClass, NgIf} from "@angular/common";
import {UserProfileComponent} from './user-profile/user-profile.component';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterOutlet,
    NgProgressComponent,
    SideBarNavigationItemComponent,
    MenuComponent,
    AsideUserFooterComponent,
    UserProfileComponent
  ],
  templateUrl: './layout.component.html',

  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  locService = inject(Location)
  sideNavigation = SideNavigationData;
  sideNavigationFooter = SideNavigationFooter;
  dp: any;
  closeResult: any
  showAside: boolean = true;
  protected readonly open = open;
  areaLogo = '/assets/tibet-realty/my-new-logo.png';
  protected readonly env = environment;

  toggleAside() {
    this.showAside = !this.showAside;
  }

  PreviousRoute() {
    this.locService.back();
  }
}
