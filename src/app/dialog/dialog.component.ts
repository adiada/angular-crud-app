import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  actionBtn : string = 'save';
  freshnessList = ['Brand New', 'Second Hand', 'Refurbished']
  productForm !: FormGroup
  
  constructor(
    private formBuilder : FormBuilder, 
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any, 
    private dialogRef : MatDialogRef<DialogComponent>) { }
 
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['',[Validators.required,Validators.minLength(5)]],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price : ['', Validators.required],
      comment : ['',Validators.required],
      date: ['',Validators.required]
    })


    if(this.editData){
      this.actionBtn = 'Update'
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

    // console.log(this.editData);
  }
  

  get productName(){
    return this.productForm.get('productName')
  }

  get category(){
    return this.productForm.get('category')
  }

  get freshness(){
    return this.productForm.get('freshness')
  }

  get price(){
    return this.productForm.get('price')
  }

  get comment(){
    return this.productForm.get('comment')
  }

  get date(){
    return this.productForm.get('date')
  }

  addProduct(){

    if(!this.editData){
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res) => {
              // alert('Product added successfuly!');
              this.productForm.reset()
              this.dialogRef.close('save');
            },
            error: () => {
              alert('Error while adding the product ')
            }
          })
      }

      // console.log(this.productForm.value);
    } else
    {
      this.updateProduct()
    }
  } 

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next: (res) => {
        // alert('Product updated successfuly');
        this.productForm.reset();
        this.dialogRef.close('update')
      },
      error : (error) => {
        alert('Error while updating the record')
      }
    })
  }
}
