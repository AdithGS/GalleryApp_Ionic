import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.page.html',
  styleUrls: ['./detail-view.page.scss'],
})
export class DetailViewPage implements OnInit {
  authorName: string = '' // stores authors name
  downloadUrl: string = '' // store download url
  height: string = '' // stores height of image
  width: string = '' // stores width of image
  imageUrl: string = ''  // stores imageUrl
  constructor(public router: Router, public activatedRoute: ActivatedRoute,@Inject(DOCUMENT) private document: Document,) { }

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.authorName = queryParams['author']
    this.downloadUrl = queryParams['downloadUrl']
    this.height = queryParams['height']
    this.width = queryParams['width']
    this.imageUrl = queryParams['imageUrl']
  }
/**
 * function- navigates back to gallery 
 */
  onBackMob() {
    this.router.navigate(['home']);
  }
  /**
   * function- for downloading image
   * @param url 
   */
  downloadImage(url:string){
    this.document.location.href = url;
  }

}
