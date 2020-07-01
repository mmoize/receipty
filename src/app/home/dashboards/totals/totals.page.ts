import { SegmentChangeEventDetail } from '@ionic/core';
import { Component, OnInit } from '@angular/core';
import { ReceiptsServiceService } from '../../explore/receipts/receipts-service.service';
import { AuthServiceService } from 'src/app/authentication/auth-service.service';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.page.html',
  styleUrls: ['./totals.page.scss'],
})
export class TotalsPage implements OnInit {
  constructor( private receiptService: ReceiptsServiceService,
               private authService: AuthServiceService,
              ) { }
  userReceiptCal;
  dashboardSegment = true;
  receiptViewSegment = false;
  savedviewSegment = false;

  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };

  ngOnInit() {

  }

  ionViewWillEnter() {
   this.loadUpStats();
  }

  loadUpStats() {
    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.receiptService.userReceiptData(tokens).subscribe(resData => {
        this.userReceiptCal = resData; // user receipts stats
      });
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
      console.log(event.detail);
      if (event.detail.value === 'dashboard') {
          this.dashboardSegment = true;
      } else {
        this.dashboardSegment = false;
      }
      if (event.detail.value === 'receipts') {
          // this.receiptViewSegment = true;
          this.dashboardSegment = true;
      } else {
        this.receiptViewSegment = false;
      }
      if (event.detail.value === 'saved') {
         this.savedviewSegment = true;
      } else {
        this.savedviewSegment = false;
      }
    }

}
