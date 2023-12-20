import { Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Clinic Medic';
  constructor() { 
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Ensure jQuery is loaded before using it
    if (typeof jQuery !== 'undefined') {
      // Document is ready
      $(document).ready(() => {
        // Toggle "full_content" class when ".sld-btn" is clicked
        $('body').on('click', '.sld-btn', () => {
          $("body").toggleClass("full_content");

          if($("body").hasClass('full_content')){
            $('#offcanvasScrolling').removeClass('show');
          }else{
            $('#offcanvasScrolling').addClass('show');
          }

          setTimeout(function(){
            if($("body").hasClass('full_content')){
              $('#offcanvasScrolling').removeClass('show');
            }else{
              $('#offcanvasScrolling').addClass('show');
            }
          },400)
        });

        // Check window width and toggle class accordingly
        if (window.innerWidth <= 991) {
          $(".offcanvas.offcanvas-start").removeClass("show");
          $("body").addClass("full_content");

          // Toggle "full_content" class when ".cst-toogle" is clicked
          $('body').on('click', '.cst-toogle', () => {
            $("body").toggleClass("full_content");
          });
        }
      });
    }
  }
}
