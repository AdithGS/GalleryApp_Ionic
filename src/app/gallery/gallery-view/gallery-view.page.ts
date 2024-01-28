import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService } from '../api-call.service';
import { InfiniteScrollCustomEvent, NavController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/common/storage.service';
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
  combinedData: any = []
  latestData: any = []
  imageApiSubscription: Subscription | undefined
  dataFromLocal: any = []
  dummyData: any = [] // dummy data
  constructor(
    public serviceFile: ApiCallService,
    private appStorage: Storage,
    public router: Router,
    private toastController: ToastController,
    public navController: NavController

  ) { }

  async ngOnInit() {
    // this.loadData(this.pageIndex, '')
    await this.appStorage.create();
  }
  ionViewWillEnter() {
    console.log("ion view")
    this.imageData = [];
    this.pageIndex = 1;
    this.loadData(this.pageIndex, '')
    // images rendered using this data
    // this.dummyData = [
    //   {'id':1,"url":"https://images.unsplash.com/flagged/1/apple-gear-looking-pretty.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "author":'Adith'},
    //   {'id':2,"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/341px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg",
    // "author":'Adith'},
    //   {'id':3,"url":"https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg",
    // "author":'Adith'},
    //   {'id':4,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAhvc-YjdwsimlEYdOknxcvbgNOVSHWjkWQ&usqp=CAU",
    // "author":'Adith'},
    //   {'id':5,"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE5fPhctwNLodS9VmAniEw_UiLWHgKs0fs1w&usqp=CAU",
    // "author":'Adith'},
    //   {'id':6,"url":"https://images.unsplash.com/flagged/1/apple-gear-looking-pretty.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // "author":'Adith'},
    // ]
    // const localData:any = this.appStorage.get('imageData')
    // this.imageData = JSON.parse(localData)
    // console.log("imageData",this.imageData)
  }
  ionViewDidLoad() {

  }
  /**
   * 
   * @param pageIndex //page index incremented on infinte scroll
   * @param event // event to mark infinite scroll complete
   */
  loadData(pageIndex: any, event: any) {
    console.log("Page Index", pageIndex)
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
      console.log("Image data", this.imageData)
    })
    // this.appStorage.get('imageData').then((val) =>{
    //   console.log("Value",val)
    // })
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
    console.log('clicked here')
    this.router.navigate(['/add-new'])
  }
  ngOnDestroy() {
    this.imageApiSubscription?.unsubscribe()
  }
}
