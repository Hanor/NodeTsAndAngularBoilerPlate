import { Component, OnInit, HostListener} from '@angular/core';
import { SystemService } from './system/system.service';
import { UserService } from './user/user.service';
import { UserModel } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  retracted: boolean = false;
  systemName: string = 'NoAnTS';
  user: UserModel;
  

  constructor(
    private systemService: SystemService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.systemService.systemId = this.systemName.replace(/ /g, '');
    this.retracted = this.wasUserRetracted();
    this.user = this.systemService.getSessionVariableAsJson('currentUser');
    this.userService.currentUser$.next(this.user);
    
    this.interfaceAdjust(window.innerWidth);
    this.eventUserChange();
  }
  interfaceAdjust(width: number) {
    if (!this.retracted && width < 670) {
      this.retracted = true;
    } else if (width > 670 && this.retracted && !this.wasUserRetracted()) {
      this.retracted = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  eventResize(event) {
    this.interfaceAdjust(event.target.innerWidth);
  }
  eventRetract() {
    if (window.innerWidth > 670) {
      this.retracted = !this.retracted;
      this.systemService.setSessionVariable('retracted', '' + this.retracted);
    }
  }
  eventUserChange() {
    this.userService.currentUser$.subscribe((user) => this.user = user);
  }
  wasUserRetracted() {
    return (this.systemService.getSessionVariable('retracted') === 'true') ? true : false
  }
}
