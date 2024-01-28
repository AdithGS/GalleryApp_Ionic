import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService } from '../api-call.service';
import { InfiniteScrollCustomEvent, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.page.html',
  styleUrls: ['./gallery-view.page.scss'],
})
export class GalleryViewPage implements OnInit, OnDestroy {
  imageData: any = []; // array to hold imageData from API
  gridView: boolean = true; // boolean used for toggling view
  pageIndex: number = 1; // store page index
  limit: number = 15; // limit of document to be fetched on single Api call
  isToastOpen: boolean = false; // boolean to manage toast
  latestData: any = [] // new batch of data
  imageApiSubscription: Subscription | undefined // subsciption to fetch image
  dataFromLocal: any = []
  constructor(
    public serviceFile: ApiCallService,
    private appStorage: Storage,
    public router: Router,
    private toastController: ToastController,
    public navController: NavController

  ) { }

  async ngOnInit() {
    await this.appStorage.create();
  }
  ionViewWillEnter() {
    this.imageData = [];
    this.pageIndex = 1;
    this.loadData(this.pageIndex, '')
  }
  /**
   * 
   * @param pageIndex //page index incremented on infinte scroll
   * @param event // event to mark infinite scroll complete
   */
  loadData(pageIndex: any, event: any) {
    // console.log("Page Index", pageIndex)
    this.imageApiSubscription = this.serviceFile.fetchImageData(this.pageIndex, this.limit).subscribe((data) => {
      this.latestData = data;
      this.imageData = [...this.imageData, ...this.latestData];
      this.appStorage.set('imageData', this.imageData);
      // this.dataFromLocal = this.appStorage.getData()
      this.pageIndex = pageIndex;
      if (event) (event as InfiniteScrollCustomEvent).target.complete();
      if (this.latestData.length == 0) {
        event.target.disabled = true;
      }
      // console.log("Image data", this.imageData)
    })
    
  }

  /**
   * function - used for infinite scroll
   * @param pageIndex //pageIndex incremented value on scoll
   * @param event // infinite scrolll event
   */
  onPageScrolled(pageIndex: number, event: any) {
    this.loadData(pageIndex, event)
  }

  /**
   * function-toggle view
   */
  toggleView() {
    this.gridView = !this.gridView
  }
  /**
   * function- routing along with query params
   * @param item // selected image
   */
  routeToImage(item: any) {
    // queryParams
    const queryParams = {
      queryParams: {
        imageUrl: item.url,
        author: item.author,
        downloadUrl: item.download_url,
        height: item.height,
        width: item.width
      }
    }
    this.navController.navigateRoot(['detail-view'], queryParams)
  }
  /**
   * 
   * @param message //message displayed on toast
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  /**
   * function - delete image on swipe from list page
   * @param id //id of the image to be deleted
   * @param event //to prevent propogation to detail page
   */
  deleteOnSwipe(id: any, event: any) {
    event.stopPropagation()
    this.isToastOpen = true;
    const index = this.imageData.findIndex((ele: any) => ele.id == id)
    // console.log("image data before",this.imageData.length)
    if (index >= 0) {
      this.imageData.splice(index, 1)
    }
    this.serviceFile.deleteData('imageData', index);
    // console.log(this.appStorage.getData())
    this.presentToast("Image deleted successfully...!!")

  }
  addnewImage() {
    this.router.navigate(['/add-new'])
  }
  ngOnDestroy() {
    this.imageApiSubscription?.unsubscribe()
  }
}
