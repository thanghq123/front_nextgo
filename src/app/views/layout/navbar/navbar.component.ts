import {Component, OnInit, ViewChild, ElementRef, Inject, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {LocalStorageService} from "../../../service/localStorage/localStorage.service";
import {LocationsService} from "../../../service/locations/locations.service";
import {Locations} from "../../../interface/locations/locations";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: any;
  public locations: Locations[] = [];
  public activeLocation: Locations | undefined;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private localStorageService: LocalStorageService,
    private locationService: LocationsService,
  ) {
  }

  ngOnInit(): void {
    this.user = this.localStorageService.get('user');
    this.locationService.GetData().subscribe(
      (response: any) => {
        if (response.status) {
          this.locations = response.payload;
          this.activeLocation = this.locations.find((location) => location.id === this.localStorageService.get('location_id'));
        }
      }
    );
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();

    this.localStorageService.remove('isLoggedin');

    this.localStorageService.remove('auth_token');

    this.localStorageService.remove('token_type');

    this.localStorageService.remove('token');

    this.localStorageService.remove('expires_at');

    this.localStorageService.remove('user');

    this.localStorageService.remove('location_id');

    this.localStorageService.remove('inventory_id');

    this.localStorageService.remove('domain_name');

    if (!this.localStorageService.get('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

  setActiveLocation(location: Locations) {
    this.localStorageService.set('location_id', location.id);
    this.localStorageService.set('inventory_id', location.inventory.id);
    this.activeLocation = location;
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

}
