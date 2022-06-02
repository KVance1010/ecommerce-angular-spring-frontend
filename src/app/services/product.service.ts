import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
providedIn: 'root'
})
export class ProductService {

private baseUrl = 'http://localhost:8080/api/products';
private categoryUrl = 'http://localhost:8080/api/product-category';

constructor(private httpClient: HttpClient) { }

searchProducts(theKeyWord: string): Observable<Product[]> {
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;
return this.getProducts(searchUrl);
}

getProductList(theCategoryId: number): Observable<Product[]> {
const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
return this.getProducts(searchUrl);
}

getProductListPaginate(thePage: number,
                       thePageSize: number,
                       theCategoryId: number): Observable<GetResponseProducts> {
const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                  + `&page=${thePage}&size=${thePageSize}`;
return this.httpClient.get<GetResponseProducts>(searchUrl);
}

getProductCategories(): Observable<ProductCategory[]> {
return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
map(response => response._embedded.productCategory));
}

getProducts(searchUrl: string): Observable<Product[]> {
return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
map(response => response._embedded.products));
}

getProduct(theProductId: number): Observable<Product> {
// need to build the url based on the product id
const productUrl = `${this.baseUrl}/${theProductId}`;
return this.httpClient.get<Product>(productUrl); }
}

interface GetResponseProducts {
_embedded: {
products: Product[];
},
page: {
size: number,
totalElements: number,
totalPages: number,
number: number
 };
}

interface GetResponseProductCategory {
_embedded: {
productCategory: ProductCategory[];
};
}


