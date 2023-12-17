import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-signature-page',
  templateUrl: './signature-page.component.html',
  styleUrls: ['./signature-page.component.scss'],
})
export class SignaturePageComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) signaturePadElement?: ElementRef;
  @Output() base64 = new EventEmitter();
  signaturePad: any;

  constructor(private elementRef: ElementRef, private navCtrl: NavController) {}

  ngOnInit() {}

  initComponent() {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight = 140;
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  public ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement?.nativeElement,
      {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255, 255, 255)',
      }
    );
    this.signaturePad.clear();
  }

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    } else {
      return false;
    }
  }

  saveSignature() {
    const dataUrl = this.signaturePad.toDataURL('image/png');
    this.base64.emit(dataUrl);
  }

  // convertBase64toBlob(dataURL: any): Blob {
  //   const data = atob(dataURL.substring('data:image/png;base64,'.length)),
  //     asArray = new Uint8Array(data.length);

  //   for (var i = 0, len = data.length; i < len; ++i) {
  //     asArray[i] = data.charCodeAt(i);
  //   }
  //   const blob = new Blob([asArray], { type: 'image/png' });
  //   return blob;
  // }

  clear() {
    this.signaturePad.clear();
  }
}
