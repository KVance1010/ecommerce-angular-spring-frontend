import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
selector: 'app-product-list',
templateUrl: './product-list-grid.component.html',
styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

products: Product[];
currentCategoryId: number;
previousCategoryId: number;
currentCategoryName: string;
searchMode: boolean;

pageSize: number = 8;
pageNumber:number = 1;
totalElements: number = 0;

constructor(private productService: ProductService, private route: ActivatedRoute) { }

ngOnInit(): void {
this.route.paramMap.subscribe(() => {
this.listProducts(); });
}

listProducts(): void{
this.searchMode = this.route.snapshot.paramMap.has('keyword');
if (this.searchMode){
 this.handleSearchProducts(); }
else{
this.handleListProducts(); }
}

handleListProducts(): void{
 // check if "id" parameter is available
const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
if (hasCategoryId) {
// get the "id" param string. convert string to a number using the "+" symbol
this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
 // get the "name" param string
this.currentCategoryName = this.route.snapshot.paramMap.get('name');
} else {
// not category id available ... default to category id 1
this.currentCategoryId = 1; }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1; }

this.previousCategoryId = this.currentCategoryId;

console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.pageNumber}`);

// now get the products for the given category id
this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }
  private processResult(): any {
  return (data: any) => {
    this.products = data._embedded.products;
    this.pageNumber = data.page.number + 1;
    this.pageSize = data.page.size;
    this.totalElements = data.page.totalElements;
  };
}

handleSearchProducts(): void{
 const theKeyWord: string = this.route.snapshot.paramMap.get('keyword');
// now search for products using keyword
 this.productService.searchProducts(theKeyWord).subscribe(
 data => {
 this.products = data;
 });
}

updatePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
}
}
