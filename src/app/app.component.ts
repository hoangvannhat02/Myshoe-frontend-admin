import { AfterContentInit, AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'admin-front';
  menuListDisplayed = false;
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) { }
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
    }
  }
  ngAfterViewInit(): void {
    document.addEventListener('click', (event) => {
      const clickedElement = event.target as HTMLElement;
      const closestBoxManageMenu = clickedElement.closest('.box-manage-menu');
      const closestBoxUser = clickedElement.closest('.box-user');
      if(closestBoxManageMenu){
        event.preventDefault();
        const menuListElement = closestBoxManageMenu.nextElementSibling as HTMLElement;
        
        if(menuListElement){
          menuListElement.classList.toggle('show');       
        }
      }
      if (closestBoxUser) {
        const itemBoxUser = closestBoxUser.nextElementSibling as HTMLElement;
        if (itemBoxUser) {
          const hasHiddenClass = itemBoxUser.classList.contains('hidden');

          if (hasHiddenClass) {
            this.renderer.removeClass(itemBoxUser, 'hidden');
          } else {
            this.renderer.addClass(itemBoxUser, 'hidden');
          }
        }
      }
    });
  }
  closeModel() {
    const showModel = this.el.nativeElement.querySelector('.showmodel');
    this.renderer.setStyle(showModel, 'display', 'none');
  }
}
