import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiCallService } from '../api-call.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {
  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public storage: ApiCallService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Upload Attachment ',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.inputAttachment();
          },
        },
      ],
    });

    await alert.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  inputAttachment() {
    const element: HTMLElement = document.getElementsByClassName(
      'attachment-selector'
    )[0] as HTMLElement;
    element.click();
  }
  /**
   * function- upload file to storage
   * @param e //event
   */
  async uploadImage(e: any) {
    let file = e.target.files[0];
    const blobUrl = URL.createObjectURL(file);

    const uploadDoc = {
      id: '1',
      author: 'Adith',
      download_url: blobUrl,
      width: 720,
      height: 720,
      url: blobUrl,
    };

    await this.storage.addData('imageData', JSON.stringify(uploadDoc));
    this.router.navigate(['home']);
  }
  /**
   * function- navigates back to gallery
   */
  onBackMob() {
    this.router.navigate(['home']);
  }
}
