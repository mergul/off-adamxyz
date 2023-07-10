// import {Component, OnDestroy} from '@angular/core';
// import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import {UserService} from '../core/user.service';
// import {User} from '../core/user.model';
// import {FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn} from '@angular/forms';
// import {of, Subject} from 'rxjs';
// import {map, takeUntil} from 'rxjs/operators';
// import {NewsService} from '../core/news.service';

// @Component({
//     template: `
//         <div class="modal-header">
//             <h4 class="modal-title">Hi there!</h4>
//             <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
//                 <span aria-hidden="true">&times;</span>
//             </button>
//         </div>
//         <div class="modal-body">
//             <form [formGroup]="form" (ngSubmit)="submit()" style="display: grid;">
//                 <label formArrayName="orders" *ngFor="let order of myFormArray().controls; let i = index">
//                     <input type="checkbox" [formControlName]="i">
//                     {{orders[i].name}}
//                 </label>

//                 <div *ngIf="!form.valid">At least one order must be selected</div>
//                 <br>
//                 <button [disabled]="!form.valid">submit</button>
//             </form>
//             <!--      <p><button class="btn btn-lg btn-outline-primary" (click)="open()">Launch demo modal</button></p>-->
//         </div>
//         <div class="modal-footer">
//             <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
//         </div>
//     `
// })
// export class NgbdModal1ContentComponent implements OnDestroy {
//     form: FormGroup;
//     orders = [];
//     private readonly onDestroy = new Subject<void>();

//     ngOnDestroy() {
//         this.onDestroy.next();
//         this.onDestroy.complete();
//     }

//     constructor(private modalService: NgbModal, public activeModal: NgbActiveModal
//         , private formBuilder: FormBuilder, private newsService: NewsService, private userService: UserService) {
//         this.form = this.formBuilder.group({
//             orders: new FormArray([], minSelectedCheckboxes(1))
//         });
//         of(this.getOrders()).pipe(takeUntil(this.onDestroy)).subscribe(orders => {
//             this.orders = orders;
//             this.addCheckboxes();
//         });
//     }

//     private addCheckboxes() {
//         this.orders.map((o, i) => {
//             const control = new FormControl(i === 0); // if first item set to true, else false
//             (this.form.controls.orders as FormArray).push(control);
//         });
//     }

//     getOrders() {
//         return [
//             {id: 100, name: '#Şiddet'},
//             {id: 200, name: '#Müstehcen'},
//             {id: 300, name: '#Nefret Söylemi'},
//             {id: 400, name: '#order'}
//         ];
//     }

//     myFormArray() {
//         return this.form.controls['orders'] as FormArray;
//     }

//     submit() {
//         const selectedOrderIds = this.form.value.orders
//             .map((v, i) => v ? this.orders[i].name : null)
//             .filter(v => v !== null);
//         this.newsService.newsPayload.tags = selectedOrderIds;
//         this.newsService.newsPayload.topics = selectedOrderIds;
//         return this.newsService.sendReport(this.newsService.newsPayload,
//             this.userService.dbUser.roles.includes('ROLE_ADMIN'))
//             .pipe(map(value => value.valueOf())).pipe(takeUntil(this.onDestroy))
//             .subscribe(gg => this.activeModal.close('Close click'));
//     }
// }

// function minSelectedCheckboxes(min = 1) {
//     const validator: ValidatorFn = (formArray: FormArray) => {
//         const totalSelected = formArray.controls
//             .map(control => control.value)
//             .reduce((prev, next) => next ? prev + next : prev, 0);

//         return totalSelected >= min ? null : {required: true};
//     };

//     return validator;
// }

// @Component({
//     selector: 'app-ngbd-modal-stacked',
//     templateUrl: './modal-stacked.html'
// })
// export class NgbdModalStackedComponent {
  //    isManager: boolean;
//     constructor(private modalService: NgbModal, private userService: UserService) {
//    this.isManager = this.user && (this.user.roles.includes('ROLE_ADMIN')
//                || this.user.roles.includes('ROLE_MODERATOR'));
//     }

//     get user(): User {
//         return this.userService.dbUser;
//     }

//     open() {
//         this.modalService.open(NgbdModal1ContentComponent);
//     }

// }
